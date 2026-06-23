import { getResidentIncidents } from '@/lib/actions/resident'
import ResidentClient from './client'

export const dynamic = 'force-dynamic';

export default async function ResidentPage() {
  const incidents = await getResidentIncidents()
  return <ResidentClient incidents={incidents} />
}
