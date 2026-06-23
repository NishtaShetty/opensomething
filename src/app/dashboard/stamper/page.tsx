import StamperClient from './client'
import { getPendingIncidents, getPendingAssignments, getPendingResolutions } from '@/lib/actions/stamper'

export const dynamic = 'force-dynamic';

export default async function StamperDashboard() {
  const incidents = await getPendingIncidents()
  const assignments = await getPendingAssignments()
  const resolutions = await getPendingResolutions()

  return <StamperClient incidents={incidents} assignments={assignments} resolutions={resolutions} />
}
