'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const DUMMY_SOCIETY_ID = "00000000-0000-0000-0000-000000000000"

export async function submitIncident(
  category: string,
  description: string,
  gpsCoords: string,
  imageHash: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: societies, error: socErr } = await supabase.from('societies').select('id').limit(1);
  
  if (socErr || !societies || societies.length === 0) {
    throw new Error("No society found in the database. Please insert a dummy society in your Supabase SQL editor first.");
  }
  
  const societyId = societies[0].id;

  // Insert incident
  const { data: incident, error } = await supabase
    .from('incidents')
    .insert({
      reporter_id: user.id,
      society_id: societyId,
      category,
      description,
      gps_coords: gpsCoords,
      image_hash: imageHash,
      status: 'pending_ai',
      reporter_wallet: '0x0000000000000000000000000000000000000000'
    })
    .select()
    .single()

  if (error) {
    console.error("DB Error:", error)
    throw new Error(error.message)
  }

  // AI Pipeline Mock
  await new Promise(r => setTimeout(r, 1000));
  
  let criticality = 'Medium';
  let suggestedDept = 'Maintenance';
  let estimatedSLAHours = 48;
  const lowerDesc = description.toLowerCase();
  
  if (category === 'Waterlogging' || lowerDesc.includes('flood') || lowerDesc.includes('water')) {
    criticality = 'High'; suggestedDept = 'Plumbing'; estimatedSLAHours = 12;
  } else if (category === 'PowerOutage' || lowerDesc.includes('electricity') || lowerDesc.includes('power')) {
    criticality = 'Critical'; suggestedDept = 'Electrical'; estimatedSLAHours = 4;
  } else if (category === 'LiftBreakdown') {
    criticality = 'Critical'; suggestedDept = 'Elevator'; estimatedSLAHours = 6;
  }

  const { error: aiError } = await supabase
    .from('incidents')
    .update({
      ai_criticality: criticality,
      ai_suggested_dept: suggestedDept,
      ai_estimated_sla_hours: estimatedSLAHours,
      ai_reasoning: `Based on the keywords and category '${category}', AI routed to dept ${suggestedDept} with SLA ${estimatedSLAHours}h.`,
      status: 'ai_checked'
    })
    .eq('id', incident.id)

  if (aiError) {
    console.error("AI Update Error:", aiError)
  }

  revalidatePath('/dashboard/resident')
  return { success: true, incidentId: incident.id }
}

export async function getResidentIncidents() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('reporter_id', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error(error)
  return data || []
}
