'use client'

import { useState, useRef } from 'react'
import { Briefcase, CheckCircle, Clock, UploadCloud } from 'lucide-react'
import { respondToAssignment, submitResolutionProof } from '@/lib/actions/vendor'

export default function VendorClient({ newJobs, activeJobs }: { newJobs: any[], activeJobs: any[] }) {
  const [loading, setLoading] = useState(false)
  const [activeFormId, setActiveFormId] = useState<string | null>(null)
  const [beforeFile, setBeforeFile] = useState<File | null>(null)
  const [afterFile, setAfterFile] = useState<File | null>(null)
  
  const beforeInputRef = useRef<HTMLInputElement>(null)
  const afterInputRef = useRef<HTMLInputElement>(null)

  async function handleResponse(id: string, accepted: boolean) {
    setLoading(true)
    try {
      await respondToAssignment(id, accepted)
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleResolutionSubmit(e: React.FormEvent<HTMLFormElement>, assignment: any) {
    e.preventDefault()
    if (!beforeFile || !afterFile) {
      alert("Both before and after photos are required.")
      return
    }
    setLoading(true)
    
    try {
      // Upload Before
      const bf = new FormData()
      bf.append('file', beforeFile)
      const bRes = await fetch('/api/upload', { method: 'POST', body: bf })
      if (!bRes.ok) throw new Error("Before upload failed")
      const beforeData = await bRes.json()

      // Upload After
      const af = new FormData()
      af.append('file', afterFile)
      const aRes = await fetch('/api/upload', { method: 'POST', body: af })
      if (!aRes.ok) throw new Error("After upload failed")
      const afterData = await aRes.json()

      const form = e.target as HTMLFormElement;
      const formDataObj = new FormData(form);
      const cost = parseFloat(formDataObj.get('cost') as string);
      const materials = formDataObj.get('materials') as string;

      await submitResolutionProof(
        assignment.incident_id,
        assignment.id,
        beforeData.ipfsHash,
        afterData.ipfsHash,
        cost,
        materials
      )
      
      alert("Resolution proof submitted successfully!")
      setActiveFormId(null)
      setBeforeFile(null)
      setAfterFile(null)
    } catch(err: any) {
      console.error(err)
      alert("Submission failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-success to-primary">Vendor Assignments</h2>
          <p className="text-gray-400 mt-2">Manage your maintenance jobs and submit resolution proofs.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">Vendor Rating</div>
          <div className="text-2xl font-bold text-success flex items-center gap-2 justify-end">
             98/100
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* New Job Alert */}
        <div className="glass-panel p-6 border-l-4 border-l-warning">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Briefcase className="text-warning" /> New Job Offers
            </h3>
          </div>
          
          {newJobs.length === 0 ? (
            <div className="text-gray-500 text-sm">No new job offers.</div>
          ) : (
            newJobs.map((job) => (
              <div key={job.id} className="bg-black/20 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium mb-1">Incident: {job.incident_id.slice(0,8)}</h4>
                  <span className="badge-pending px-2 py-0.5 rounded text-xs">Action Required</span>
                </div>
                {job.incidents && <p className="text-sm text-gray-400">{job.incidents.description}</p>}
                
                <div className="mt-4 flex gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1 text-gray-300"><Clock size={16} className="text-accent" /> SLA: {job.sla_hours} Hours</div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => handleResponse(job.id, true)} disabled={loading} className="glass-button flex-1 bg-gradient-to-r from-success to-green-600">Accept</button>
                  <button onClick={() => handleResponse(job.id, false)} disabled={loading} className="glass-button-secondary flex-1">Reject</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Active Job needing Resolution */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle className="text-primary" /> Active Assignments
            </h3>
          </div>
          
          {activeJobs.length === 0 ? (
            <div className="text-gray-500 text-sm">No active assignments.</div>
          ) : (
            activeJobs.map((job) => (
              <div key={job.id} className="border border-white/10 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Incident: {job.incident_id.slice(0,8)}</h4>
                </div>
                {job.incidents && <p className="text-sm text-gray-400 mb-4">{job.incidents.description}</p>}

                {activeFormId === job.id ? (
                  <form onSubmit={(e) => handleResolutionSubmit(e, job)} className="space-y-4 bg-black/20 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                       <div 
                         className="border border-dashed border-white/20 p-3 text-center rounded cursor-pointer hover:bg-white/5"
                         onClick={() => beforeInputRef.current?.click()}
                       >
                         {beforeFile ? <div className="text-xs text-primary truncate">{beforeFile.name}</div> : <div className="text-xs text-gray-400">Before Photo</div>}
                         <input type="file" ref={beforeInputRef} onChange={e => setBeforeFile(e.target.files?.[0] || null)} className="hidden" accept="image/*" />
                       </div>
                       <div 
                         className="border border-dashed border-white/20 p-3 text-center rounded cursor-pointer hover:bg-white/5"
                         onClick={() => afterInputRef.current?.click()}
                       >
                         {afterFile ? <div className="text-xs text-primary truncate">{afterFile.name}</div> : <div className="text-xs text-gray-400">After Photo</div>}
                         <input type="file" ref={afterInputRef} onChange={e => setAfterFile(e.target.files?.[0] || null)} className="hidden" accept="image/*" />
                       </div>
                    </div>
                    <div>
                       <input type="number" name="cost" required placeholder="Cost (INR)" className="glass-input w-full p-2 text-sm" />
                    </div>
                    <div>
                       <input type="text" name="materials" required placeholder="Materials used (e.g. PVC Pipes)" className="glass-input w-full p-2 text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={loading} className="glass-button text-sm py-2 flex-1">Submit</button>
                      <button type="button" onClick={() => setActiveFormId(null)} className="glass-button-secondary text-sm py-2 flex-1">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => setActiveFormId(job.id)} className="w-full glass-button-secondary border-primary/30 hover:border-primary text-primary transition-colors">
                    Submit Resolution Proof
                  </button>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
