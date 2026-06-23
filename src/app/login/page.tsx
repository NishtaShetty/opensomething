'use client'

import { useState } from 'react'
import { login, signup } from './actions'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const result = isLogin 
      ? await login(formData)
      : await signup(formData)
      
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent opacity-20 rounded-full blur-3xl"></div>

        <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Nishta Registry
        </h1>
        <p className="text-center text-sm text-gray-400 mb-8">
          {isLogin ? 'Sign in to access your dashboard' : 'Create an account to get started'}
        </p>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-2 mb-4">
            <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
            <span className="text-red-500 text-sm">{typeof error === 'string' ? error : JSON.stringify(error)}</span>
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required={!isLogin}
                  className="glass-input w-full p-3 rounded-lg"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select 
                  name="role" 
                  required={!isLogin}
                  className="glass-input w-full p-3 rounded-lg appearance-none"
                  defaultValue="resident"
                >
                  <option value="resident" className="bg-secondary">Resident</option>
                  <option value="stamper" className="bg-secondary">Stamper</option>
                  <option value="vendor" className="bg-secondary">Vendor</option>
                  {/* Additional roles can be added here */}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="glass-input w-full p-3 rounded-lg"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="glass-input w-full p-3 rounded-lg"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full mt-6"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-sm text-gray-400 hover:text-primary transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
