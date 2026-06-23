'use client'

import { useState, useRef } from 'react'
import { UploadCloud, AlertCircle, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import { submitIncident } from '@/lib/actions/resident'

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false })

export default function ResidentClient({ incidents }: { incidents: any[] }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!position) {
      alert("Please select a location on the map.")
      return
    }
    if (!file) {
      alert("Please upload a photo evidence.")
      return
    }
    setLoading(true)
    
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    const category = formDataObj.get('category') as string;
    const description = formDataObj.get('description') as string;
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (!uploadRes.ok) throw new Error("Upload failed")
      const uploadData = await uploadRes.json()
      
      const coords = `${position[0]},${position[1]}`

      await submitIncident(category, description, coords, uploadData.ipfsHash)
      
      setSuccess(true)
      setFile(null)
      setPosition(null)
      // reset form
      form.reset();
    } catch (err: any) {
      console.error(err)
      alert("Failed to submit: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Report an Issue</h2>
          <p className="text-gray-400 mt-2">Submit maintenance requests directly to the society administration.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
              <select name="category" className="glass-input w-full p-3 rounded-lg appearance-none">
                <option value="Waterlogging">Waterlogging</option>
                <option value="PowerOutage">Power Outage</option>
                <option value="LiftBreakdown">Lift Breakdown</option>
                <option value="FireSafety">Fire Safety</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
              <textarea 
                name="description"
                className="glass-input w-full p-3 rounded-lg h-32 resize-none" 
                placeholder="Describe the issue in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                <MapPin size={16} /> Location (Click on Map)
              </label>
              <LocationPicker position={position} setPosition={setPosition} />
              {position && <p className="text-xs text-gray-400 mt-2 font-mono">Selected: {position[0].toFixed(5)}, {position[1].toFixed(5)}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Photo Evidence</label>
              <div 
                className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:bg-white/5 transition-colors cursor-pointer group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="text-sm text-primary font-medium truncate px-4 py-2 bg-primary/10 rounded">{file.name}</div>
                ) : (
                  <>
                    <UploadCloud className="mx-auto h-8 w-8 text-gray-400 group-hover:text-primary mb-2 transition-colors" />
                    <span className="text-sm text-gray-400">Click to browse</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden" 
                  accept="image/*"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="glass-button w-full">
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
            
            {success && (
              <div className="p-3 rounded-lg bg-success/20 border border-success/30 text-success text-sm flex items-center gap-2">
                <AlertCircle size={16} /> Report submitted successfully!
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold mb-4">Your Recent Reports</h3>
          
          {incidents.length === 0 ? (
            <div className="text-gray-500 text-center py-10 glass-panel">No incidents reported yet.</div>
          ) : (
            incidents.map((incident) => (
              <div key={incident.id} className="glass-panel p-5 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:bg-white/5 transition-colors">
                <div className="w-full sm:w-32 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                   <img src={`https://gateway.pinata.cloud/ipfs/${incident.image_hash}`} className="w-full h-full object-cover" alt="incident" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">{incident.category}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      incident.status === 'pending_ai' ? 'badge-pending' : 
                      incident.status === 'ai_checked' ? 'bg-primary/20 text-primary' :
                      incident.status === 'stamped' ? 'bg-success/20 text-success' : 'bg-gray-800 text-gray-300'
                    }`}>
                      {incident.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{incident.description}</p>
                  <div className="text-xs text-gray-500 font-mono flex justify-between">
                    <span>ID: {incident.id.slice(0,8)}...</span>
                    <span>{new Date(incident.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  )
}
