'use client'

import { useState } from 'react'
import { stampIncidentOnChain, createAssignmentOnChain, createResolutionOnChain } from '@/lib/web3/actions'
import { markIncidentStamped, markAssignmentStamped, markResolutionStamped } from '@/lib/actions/stamper'
import { ShieldCheck, Cpu, Clock, CheckCircle2, Briefcase, Wrench } from 'lucide-react'

export default function StamperClient({ incidents, assignments, resolutions }: { incidents: any[], assignments: any[], resolutions: any[] }) {
  const [processingId, setProcessingId] = useState<string | null>(null)

  async function handleStampIncident(incident: any) {
    setProcessingId(incident.id)
    try {
      // Map enums to integers if necessary based on your contract, 
      // here we pass dummy ints just for the hackathon UI flow to succeed
      const tx = await stampIncidentOnChain(
        incident.id, 
        { reporter: incident.reporter_wallet || "0x0000000000000000000000000000000000000000", category: 0, description: incident.description, imageHash: incident.image_hash, gpsCoords: incident.gps_coords, note: "" },
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
    setProcessingId(resolution.id)
    try {
      const tx = await createResolutionOnChain(
        resolution.id,
        { incidentId: resolution.incident_id, assignmentId: resolution.assignment_id, vendorId: resolution.vendor_id, beforeImageHash: resolution.before_image_hash, afterImageHash: resolution.after_image_hash, costOfRepair: resolution.cost_of_repair, materialsUsed: resolution.materials_used, completedAt: Math.floor(new Date(resolution.completed_at).getTime() / 1000) }
      )
      await markResolutionStamped(resolution.id, tx.hash || "0x_dummy_hash")
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
          <Briefcase className="text-warning" /> Pending Vendor Assignments (Blocks)
        </h3>
        {assignments.length === 0 ? (
          <div className="text-gray-500 text-center py-6 bg-black/20 rounded-xl">No pending assignments.</div>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.id} className="bg-black/20 rounded-xl p-5 border border-white/5 mb-4 flex justify-between items-center">
               <div>
                 <h4 className="font-semibold text-lg mb-1">Incident ID: {assignment.incident_id.slice(0,8)}</h4>
                 <p className="text-sm text-gray-400">Vendor ID: {assignment.vendor_id.slice(0,8)} • SLA: {assignment.sla_hours} Hrs</p>
               </div>
               <button 
                  onClick={() => handleStampAssignment(assignment)}
                  disabled={processingId === assignment.id}
                  className="glass-button-secondary border-warning/50 text-warning hover:border-warning"
               >
                  {processingId === assignment.id ? 'Signing...' : 'Create Assignment Block'}
               </button>
            </div>
          ))
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
            <div key={res.id} className="bg-black/20 rounded-xl p-5 border border-white/5 mb-4 flex justify-between items-center">
               <div>
                 <h4 className="font-semibold text-lg mb-1">Resolution for Incident: {res.incident_id.slice(0,8)}</h4>
                 <p className="text-sm text-gray-400">Cost: ₹{res.cost_of_repair} • Materials: {res.materials_used}</p>
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
