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
    })
    .eq('id', incidentId)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/stamper')
}

export async function getStampedIncidentsAwaitingAssignment() {
  const supabase = await createClient()
  
  const { data: incidents, error: incError } = await supabase
    .from('incidents')
    .select('*')
    .eq('status', 'stamped')
    .order('created_at', { ascending: true })
    
  if (incError) console.error(incError)
  if (!incidents) return []

  const { data: assignments, error: assgnError } = await supabase
    .from('vendor_assignments')
    .select('incident_id, status')
    .neq('status', 'rejected') 
    
  if (assgnError) console.error(assgnError)
  
  const activeAssignmentIncidentIds = new Set((assignments || []).map(a => a.incident_id))
  
  return incidents.filter(i => !activeAssignmentIncidentIds.has(i.id))
}

export async function getVendorsByServiceType(dept: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('service_type', dept)
    
  if (error) {
    console.error(error)
    return []
  }
  return data || []
}

export async function getAllVendors() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('vendors').select('*')
  if (error) console.error(error)
  return data || []
}

export async function assignVendorToIncident(incidentId: string, vendorId: string, slaHours: number) {
  const supabase = await createClient()
  
  // Fetch the society_id associated with this incident
  const { data: incident } = await supabase.from('incidents').select('society_id').eq('id', incidentId).single()
  
  // We can fetch vendor's current rating to store a snapshot
  const { data: vendor } = await supabase.from('vendors').select('rating').eq('id', vendorId).single()

  const { data: existing } = await supabase.from('vendor_assignments').select('id').eq('incident_id', incidentId).single()

  if (existing) {
    const { error } = await supabase
      .from('vendor_assignments')
      .update({
        vendor_id: vendorId,
        society_id: incident?.society_id,
        sla_hours: slaHours,
        vendor_rating_snapshot: vendor ? vendor.rating : 100,
        status: 'pending_vendor'
      })
      .eq('incident_id', incidentId)

    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('vendor_assignments')
      .insert({
        incident_id: incidentId,
        vendor_id: vendorId,
        society_id: incident?.society_id,
        sla_hours: slaHours,
        vendor_rating_snapshot: vendor ? vendor.rating : 100,
        status: 'pending_vendor'
      })

    if (error) throw new Error(error.message)
  }

  revalidatePath('/dashboard/stamper')
}

export async function cancelAssignment(assignmentId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('vendor_assignments')
    .update({ status: 'rejected' }) 
    .eq('id', assignmentId)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/stamper')
}

export async function getPendingAssignments() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vendor_assignments')
    .select('*, incidents(*)')
    .in('status', ['vendor_approved', 'pending_vendor'])
  
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

export async function markResolutionStamped(resolutionId: string, txHash: string, rating: number, vendorId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('resolutions')
    .update({
      status: 'stamped',
      tx_hash: txHash,
      stamper_rating: rating 
    })
    .eq('id', resolutionId)

  if (error) throw new Error(error.message)

  if (vendorId) {
    const { data: vendor } = await supabase.from('vendors').select('rating, jobs_completed').eq('id', vendorId).single()
    if (vendor) {
      const newJobsCompleted = (vendor.jobs_completed || 0) + 1;
      const currentRating = vendor.rating || 5;
      const newRating = ((currentRating * vendor.jobs_completed) + rating) / newJobsCompleted;
      
      await supabase.from('vendors').update({
        rating: Math.round(newRating * 10) / 10,
        jobs_completed: newJobsCompleted
      }).eq('id', vendorId)
    }
  }

  revalidatePath('/dashboard/stamper')
}
