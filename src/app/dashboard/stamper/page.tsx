import StamperClient from './client'
import { getPendingIncidents, getPendingAssignments, getPendingResolutions, getStampedIncidentsAwaitingAssignment, getAllVendors } from '@/lib/actions/stamper'

export const dynamic = 'force-dynamic';

export default async function StamperDashboard() {
  const incidents = await getPendingIncidents()
  const assignments = await getPendingAssignments()
  const resolutions = await getPendingResolutions()
  const stampedIncidents = await getStampedIncidentsAwaitingAssignment()
  const vendors = await getAllVendors()

  return <StamperClient incidents={incidents} assignments={assignments} resolutions={resolutions} stampedIncidents={stampedIncidents} vendors={vendors} />
}
