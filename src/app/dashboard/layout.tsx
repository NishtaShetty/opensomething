import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/login/actions'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-panel rounded-none border-t-0 border-l-0 border-r-0 border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            {user.user_metadata?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="font-semibold">{user.user_metadata?.name || 'User'}</h1>
            <span className="text-xs text-gray-400 capitalize">{user.user_metadata?.role || 'Resident'} Dashboard</span>
          </div>
        </div>
        <form action={signOut}>
          <button type="submit" className="glass-button-secondary px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Sign Out
          </button>
        </form>
      </header>
      <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
