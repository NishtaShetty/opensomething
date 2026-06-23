'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPendingIncidents() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('status', 'ai_checked')
    .order('created_at', { ascending: true })

  if (error) console.error(error)
  return data || []
}

export async function markIncidentStamped(incidentId: string, txHash: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('incidents')
    .update({
      status: 'stamped',
      tx_hash: txHash,
      // stamped_at is technically supposed to be block timestamp, doing local for hackathon simplicity
    })
    .eq('id', incidentId)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/stamper')
}

export async function getPendingAssignments() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vendor_assignments')
    .select('*')
    .eq('status', 'vendor_approved')
  
  if (error) console.error(error)
  return data || []
}

export async function markAssignmentStamped(assignmentId: string, txHash: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('vendor_assignments')
    .update({
      status: 'stamped',
      tx_hash: txHash,
    })
    .eq('id', assignmentId)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/stamper')
}

export async function getPendingResolutions() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resolutions')
    .select('*')
    .eq('status', 'pending_stamp')
  
  if (error) console.error(error)
  return data || []
}

export async function markResolutionStamped(resolutionId: string, txHash: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('resolutions')
    .update({
      status: 'stamped',
      tx_hash: txHash,
    })
    .eq('id', resolutionId)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/stamper')
}
