'use client'

import { useState } from 'react'
import { stampIncidentOnChain, createAssignmentOnChain, createResolutionOnChain } from '@/lib/web3/actions'
import { markIncidentStamped, markAssignmentStamped, markResolutionStamped, assignVendorToIncident, cancelAssignment } from '@/lib/actions/stamper'
import { ShieldCheck, Cpu, Clock, CheckCircle2, Briefcase, Wrench, Star } from 'lucide-react'

export default function StamperClient({ incidents, assignments, resolutions, stampedIncidents = [], vendors = [] }: { incidents: any[], assignments: any[], resolutions: any[], stampedIncidents?: any[], vendors?: any[] }) {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedVendorIds, setSelectedVendorIds] = useState<Record<string, string>>({})
  const [vendorSLA, setVendorSLA] = useState<Record<string, number>>({})
  const [resolutionRatings, setResolutionRatings] = useState<Record<string, number>>({})

  async function handleStampIncident(incident: any) {
    setProcessingId(incident.id)
    try {
      // Map enums to integers if necessary based on your contract, 
      // here we pass dummy ints just for the hackathon UI flow to succeed
      const tx = await stampIncidentOnChain(
        incident.id, 
        { reporter: (!incident.reporter_wallet || incident.reporter_wallet === "0x0000000000000000000000000000000000000000") ? "0x1234567890123456789012345678901234567890" : incident.reporter_wallet, category: 0, description: incident.description, imageHash: incident.image_hash, gpsCoords: incident.gps_coords, note: "" },
        { criticality: 1, suggestedDept: 1, estimatedSLAHours: incident.ai_estimated_sla_hours || 24 }
      )
      await markIncidentStamped(incident.id, tx.hash || "0x_dummy_hash")
      alert("Incident Stamped Successfully!")
    } catch (e: any) {
      console.error(e)
      alert("Failed to stamp: " + e.message)
    } finally {
      setProcessingId(null)
    }
  }

  async function handleAssignVendor(incidentId: string) {
    const vId = selectedVendorIds[incidentId]
    const sla = vendorSLA[incidentId] || 24 
    if (!vId) return alert("Select a vendor")
    
    setProcessingId(incidentId + '_assign')
    try {
      await assignVendorToIncident(incidentId, vId, sla)
      alert("Vendor assigned! It is now pending vendor approval.")
    } catch (e: any) {
      alert("Error: " + e.message)
    } finally {
      setProcessingId(null)
    }
  }

  async function handleCancelAssignment(assignmentId: string) {
    if (!confirm("Cancel this assignment and re-assign?")) return
    setProcessingId(assignmentId + '_cancel')
    try {
      await cancelAssignment(assignmentId)
      alert("Assignment cancelled.")
    } catch(e: any) {
      alert("Error: " + e.message)
    } finally {
      setProcessingId(null)
    }
  }

  async function handleStampAssignment(assignment: any) {
    setProcessingId(assignment.id)
    try {
      const tx = await createAssignmentOnChain(
        assignment.id,
        { vendorId: assignment.vendor_id, incidentId: assignment.incident_id, slaHours: assignment.sla_hours, vendorRating: assignment.vendor_rating_snapshot || 100 }
      )
      await markAssignmentStamped(assignment.id, tx.hash || "0x_dummy_hash")
      alert("Assignment Stamped Successfully!")
    } catch (e: any) {
      console.error(e)
      alert("Failed to stamp assignment: " + e.message)
    } finally {
      setProcessingId(null)
    }
  }

  async function handleStampResolution(resolution: any) {
    const rating = resolutionRatings[resolution.id] || 5
    setProcessingId(resolution.id)
    try {
      const tx = await createResolutionOnChain(
        resolution.id,
        { incidentId: resolution.incident_id, assignmentId: resolution.assignment_id, vendorId: resolution.vendor_id, beforeImageHash: resolution.before_image_hash, afterImageHash: resolution.after_image_hash, costOfRepair: resolution.cost_of_repair, materialsUsed: resolution.materials_used, completedAt: Math.floor(new Date(resolution.completed_at).getTime() / 1000) }
      )
      await markResolutionStamped(resolution.id, tx.hash || "0x_dummy_hash", rating, resolution.vendor_id)
      alert("Resolution Stamped Successfully!")
    } catch (e: any) {
      console.error(e)
      alert("Failed to stamp resolution: " + e.message)
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Stamper Operations</h2>
        <p className="text-gray-400 mt-2">Review AI assessments and securely stamp incidents, assignments, and resolutions on the blockchain.</p>
      </div>

      {/* Incidents Section */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <ShieldCheck className="text-primary" /> Pending Incident Reviews
        </h3>
        {incidents.length === 0 ? (
          <div className="text-gray-500 text-center py-6 bg-black/20 rounded-xl">No pending incidents to review.</div>
        ) : (
          incidents.map((incident) => (
            <div key={incident.id} className="bg-black/20 border border-white/5 rounded-xl p-6 relative overflow-hidden mb-4">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-md text-sm font-mono">{incident.id.slice(0,8)}</span>
                    <span className="text-sm text-gray-400">Category: {incident.category}</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Description</h4>
                  <p className="text-gray-400 text-sm mb-6">{incident.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">GPS Coordinates</div>
                      <div className="font-mono text-sm">{incident.gps_coords}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg overflow-hidden">
                      <div className="text-xs text-gray-500 mb-1">Evidence Hash</div>
                      <div className="font-mono text-sm text-accent truncate">{incident.image_hash}</div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-80 bg-gradient-to-b from-secondary to-black/40 rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-2 mb-4 text-accent font-semibold">
                    <Cpu size={18} /> AI Assessment
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Criticality</span>
                        <span className={incident.ai_criticality === 'High' || incident.ai_criticality === 'Critical' ? "text-red-400 font-medium" : "text-yellow-400 font-medium"}>{incident.ai_criticality}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Department</span>
                        <span className="text-white">{incident.ai_suggested_dept}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Est. SLA</span>
                        <span className="text-white flex items-center gap-1"><Clock size={14} /> {incident.ai_estimated_sla_hours} Hours</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <button 
                      onClick={() => handleStampIncident(incident)} 
                      disabled={processingId === incident.id}
                      className="glass-button w-full flex items-center justify-center gap-2"
                    >
                      {processingId === incident.id ? 'Signing Tx...' : 'Approve & Stamp On-Chain'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assignments Section */}
      <div className="glass-panel p-6 border-l-4 border-l-warning">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Briefcase className="text-warning" /> Pending Vendor Assignments
        </h3>

        <div className="mb-8">
          <h4 className="text-lg font-medium mb-3 text-gray-300">Awaiting Vendor Selection</h4>
          {stampedIncidents.length === 0 ? (
            <div className="text-gray-500 text-sm italic">No incidents waiting for vendor assignment.</div>
          ) : (
            stampedIncidents.map(inc => {
              const availableVendors = vendors.filter(v => v.service_type === inc.ai_suggested_dept)
              return (
                <div key={inc.id} className="bg-black/20 rounded-xl p-4 border border-white/5 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="font-medium text-white">Incident {inc.id.slice(0,8)} - {inc.ai_suggested_dept}</div>
                    <div className="text-sm text-gray-400 truncate max-w-xs">{inc.description}</div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select 
                      className="glass-input p-2 text-sm rounded-lg"
                      value={selectedVendorIds[inc.id] || ''}
                      onChange={e => setSelectedVendorIds({...selectedVendorIds, [inc.id]: e.target.value})}
                    >
                      <option value="">Select Vendor...</option>
                      {availableVendors.map(v => (
                        <option key={v.id} value={v.id}>{v.name} (⭐ {v.rating || 5})</option>
                      ))}
                    </select>
                    <input 
                      type="number" 
                      placeholder="SLA (hrs)"
                      className="glass-input p-2 text-sm rounded-lg w-24"
                      value={vendorSLA[inc.id] || ''}
                      onChange={e => setVendorSLA({...vendorSLA, [inc.id]: parseInt(e.target.value)})}
                    />
                    <button 
                      onClick={() => handleAssignVendor(inc.id)}
                      disabled={processingId === inc.id + '_assign'}
                      className="glass-button-secondary text-sm px-4"
                    >
                      {processingId === inc.id + '_assign' ? 'Assigning...' : 'Assign'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <h4 className="text-lg font-medium mb-3 text-gray-300">Ready to Block / Awaiting Vendor Approval</h4>
        {assignments.length === 0 ? (
          <div className="text-gray-500 text-center py-6 bg-black/20 rounded-xl">No pending assignments.</div>
        ) : (
          assignments.map((assignment) => {
            const isPendingApproval = assignment.status === 'pending_vendor';
            // Mock SLA logic: Check if created > SLA hours ago
            const createdTime = new Date(assignment.created_at).getTime();
            const now = Date.now();
            // Using a mock SLA acceptance check of 2 hours for demonstration
            const slaBreached = isPendingApproval && (now - createdTime > 2 * 60 * 60 * 1000); 

            return (
            <div key={assignment.id} className="bg-black/20 rounded-xl p-5 border border-white/5 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                 <h4 className="font-semibold text-lg mb-1">Incident ID: {assignment.incident_id.slice(0,8)}</h4>
                 <p className="text-sm text-gray-400 flex items-center gap-2">
                   Vendor ID: {assignment.vendor_id.slice(0,8)} • SLA: {assignment.sla_hours} Hrs
                   <span className={`px-2 py-0.5 rounded text-xs ${isPendingApproval ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                     {isPendingApproval ? 'Pending Vendor Approval' : 'Vendor Approved'}
                   </span>
                 </p>
                 {slaBreached && (
                   <p className="text-red-400 text-xs mt-2 font-medium">⚠️ Vendor has not responded within expected time!</p>
                 )}
               </div>
               <div className="flex gap-2">
                 {isPendingApproval ? (
                   <button 
                      onClick={() => handleCancelAssignment(assignment.id)}
                      disabled={processingId === assignment.id + '_cancel'}
                      className="glass-button-secondary border-red-500/50 text-red-400 hover:border-red-400"
                   >
                     {processingId === assignment.id + '_cancel' ? 'Cancelling...' : 'Cancel & Re-assign'}
                   </button>
                 ) : (
                   <button 
                      onClick={() => handleStampAssignment(assignment)}
                      disabled={processingId === assignment.id}
                      className="glass-button-secondary border-warning/50 text-warning hover:border-warning"
                   >
                      {processingId === assignment.id ? 'Signing...' : 'Create Assignment Block'}
                   </button>
                 )}
               </div>
            </div>
          )})
        )}
      </div>

      {/* Resolutions Section */}
      <div className="glass-panel p-6 border-l-4 border-l-success">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Wrench className="text-success" /> Pending Resolutions
        </h3>
        {resolutions.length === 0 ? (
          <div className="text-gray-500 text-center py-6 bg-black/20 rounded-xl">No pending resolutions.</div>
        ) : (
          resolutions.map((res) => (
            <div key={res.id} className="bg-black/20 rounded-xl p-5 border border-white/5 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                 <h4 className="font-semibold text-lg mb-1">Resolution for Incident: {res.incident_id.slice(0,8)}</h4>
                 <p className="text-sm text-gray-400 mb-2">Cost: ₹{res.cost_of_repair} • Materials: {res.materials_used}</p>
                 <div className="flex items-center gap-1">
                   <span className="text-xs text-gray-400 mr-2">Rate Vendor:</span>
                   {[1,2,3,4,5].map(star => (
                     <Star 
                       key={star} 
                       size={16} 
                       className={`cursor-pointer transition-colors ${(resolutionRatings[res.id] || 5) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
                       onClick={() => setResolutionRatings({...resolutionRatings, [res.id]: star})}
                     />
                   ))}
                 </div>
               </div>
               <button 
                  onClick={() => handleStampResolution(res)}
                  disabled={processingId === res.id}
                  className="glass-button bg-success text-white hover:bg-green-600"
               >
                  {processingId === res.id ? 'Signing...' : 'Approve & Stamp Resolution'}
               </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
