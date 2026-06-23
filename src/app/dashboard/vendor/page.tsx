import VendorClient from './client'
import { getVendorAssignments } from '@/lib/actions/vendor'

export const dynamic = 'force-dynamic';

export default async function VendorDashboard() {
  const { newJobs, activeJobs } = await getVendorAssignments()

  return <VendorClient newJobs={newJobs} activeJobs={activeJobs} />
}
