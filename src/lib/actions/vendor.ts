'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getVendorAssignments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { newJobs: [], activeJobs: [] }

  const { data, error } = await supabase
    .from('vendor_assignments')
    .select('*, incidents(*)')
    .eq('vendor_id', user.id)

  if (error) {
    console.error(error)
    return { newJobs: [], activeJobs: [] }
  }

  const newJobs = data.filter(d => d.status === 'pending_vendor')
  const activeJobs = data.filter(d => d.status === 'stamped')
  
  return { newJobs, activeJobs }
}

export async function respondToAssignment(assignmentId: string, accepted: boolean) {
  const supabase = await createClient()
  // Use 'approved' to match the vendor_approval_status_enum in the database
  const approvalStatus = accepted ? 'approved' : 'rejected'
  // The main status field controls the workflow pipeline
  const workflowStatus = accepted ? 'vendor_approved' : 'rejected'
  
  const { error } = await supabase
    .from('vendor_assignments')
    .update({
      vendor_approval_status: approvalStatus,
      status: workflowStatus
    })
    .eq('id', assignmentId)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/vendor')
}

export async function submitResolutionProof(
  incidentId: string,
  assignmentId: string,
  beforeHash: string,
  afterHash: string,
  cost: number,
  materials: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Fetch society_id from the incident to satisfy the not-null constraint
  const { data: incident } = await supabase.from('incidents').select('society_id').eq('id', incidentId).single()

  const { error } = await supabase
    .from('resolutions')
    .upsert({
      incident_id: incidentId,
      assignment_id: assignmentId,
      vendor_id: user.id,
      society_id: incident?.society_id,
      before_image_hash: beforeHash,
      after_image_hash: afterHash,
      cost_of_repair: cost,
      materials_used: materials,
      status: 'pending_stamp'
    }, { onConflict: 'incident_id' })

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/vendor')
}
