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
      reporter_wallet: '0x1234567890123456789012345678901234567890'
    })
    .select()
    .single()

  if (error) {
    console.error("DB Error:", error)
    throw new Error(error.message)
  }

  // --- Real CLIP Validator Pipeline ---
  // Map the form category name to the Samriddhi CAT ID
  const categoryToCatId: Record<string, string> = {
    'Waterlogging': 'CAT001',
    'PowerOutage': 'CAT004',
    'LiftBreakdown': 'CAT007',
    'FireSafety': 'CAT005',
  };
  const reportedCatId = categoryToCatId[category] || undefined;

  let clipAction = 'FLAG';
  let clipSeverity = 'UNKNOWN';
  let clipConfidence = 0;
  let clipReason = 'CLIP validation unavailable.';
  let clipPredictedCatId = '';

  try {
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;
    console.log(`[CLIP Pipe] Fetching image from IPFS gateway: ${ipfsUrl}`);
    const imgRes = await fetch(ipfsUrl);
    console.log(`[CLIP Pipe] IPFS Gateway response: ${imgRes.status} ${imgRes.statusText}`);
    
    if (imgRes.ok) {
      const imgBlob = await imgRes.blob();
      const ext = imgBlob.type.includes('png') ? 'png' : 'jpg';
      console.log(`[CLIP Pipe] Image blob fetched. Size: ${imgBlob.size} bytes, Type: ${imgBlob.type}`);

      const clipForm = new FormData();
      clipForm.append('image', imgBlob, `incident.${ext}`);
      if (reportedCatId) clipForm.append('reported_category', reportedCatId);
      clipForm.append('incident_status', 'REPORTED');

      const CLIP_API = process.env.CLIP_VALIDATOR_URL || 'http://localhost:5001';
      console.log(`[CLIP Pipe] Posting to CLIP API: ${CLIP_API}/classify with reported_category=${reportedCatId}`);
      const clipRes = await fetch(`${CLIP_API}/classify`, {
        method: 'POST',
        body: clipForm,
      });
      console.log(`[CLIP Pipe] CLIP response: ${clipRes.status} ${clipRes.statusText}`);

      if (clipRes.ok) {
        const clipData = await clipRes.json();
        clipAction = clipData.action ?? 'FLAG';
        clipSeverity = clipData.severity ?? 'UNKNOWN';
        clipConfidence = clipData.confidence ?? 0;
        clipReason = clipData.reason ?? 'No reason provided.';
        clipPredictedCatId = clipData.predicted_category_id ?? '';
        console.log(`[CLIP Pipe] Classification Success. Action: ${clipAction}, Severity: ${clipSeverity}, Predicted: ${clipPredictedCatId}`);
      } else {
        const errorText = await clipRes.text();
        console.error(`[CLIP Pipe] CLIP API Error details: ${errorText}`);
      }
    } else {
      console.error(`[CLIP Pipe] Failed to fetch image from Pinata gateway.`);
    }
  } catch (e) {
    console.error('[CLIP Pipe] Exception occurred during validation:', e);
  }

  // Map CLIP severity → Nishta criticality labels
  const severityMap: Record<string, string> = {
    RED: 'Critical', YELLOW: 'High', INFO: 'Medium', REJECT: 'Low', UNKNOWN: 'Medium',
  };
  const criticality = severityMap[clipSeverity] ?? 'Medium';

  // Map predicted category or category string → Supabase department_enum
  const deptMap: Record<string, string> = {
    'CAT001': 'Plumbing',
    'CAT004': 'Electrical',
    'CAT007': 'Elevator',
    'CAT005': 'FireSafety',
    'Waterlogging': 'Plumbing',
    'PowerOutage': 'Electrical',
    'LiftBreakdown': 'Elevator',
    'FireSafety': 'FireSafety',
  };
  const suggestedDept = deptMap[clipPredictedCatId] || deptMap[category] || 'Maintenance';

  // Map CLIP severity + Category to SLA hours (Safety critical gets 6 hours)
  let estimatedSlaHours = 48;
  if (clipSeverity === 'RED') {
    // Safety critical auto-escalations get 6 hours
    estimatedSlaHours = 6;
  } else if (clipSeverity === 'YELLOW') {
    estimatedSlaHours = 12;
  } else if (clipSeverity === 'INFO') {
    estimatedSlaHours = 24;
  }

  const { error: aiError } = await supabase
    .from('incidents')
    .update({
      ai_criticality: criticality,
      ai_suggested_dept: suggestedDept,
      ai_estimated_sla_hours: estimatedSlaHours,
      ai_reasoning: `[CLIP ViT-L-14] ${clipReason} | Decision: ${clipAction} | Confidence: ${Math.round(clipConfidence * 100)}%`,
      status: clipAction === 'REJECT' ? 'rejected' : 'ai_checked'
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
