import { redirect } from 'next/navigation'

export default function Home() {
  // Middleware handles redirection for authenticated users.
  // If they hit the root and aren't redirected by middleware,
  // we redirect them to login.
  redirect('/login')
}
