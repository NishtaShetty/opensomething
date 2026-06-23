import { ethers } from 'ethers';
import {
  getWeb3Provider,
  INCIDENT_REGISTRY_ADDRESS,
  INCIDENT_REGISTRY_ABI,
  VENDOR_ASSIGNMENT_ADDRESS,
  VENDOR_ASSIGNMENT_ABI,
  RESOLUTION_REGISTRY_ADDRESS,
  RESOLUTION_REGISTRY_ABI
} from './contracts';

export async function stampIncidentOnChain(
  incidentId: string, 
  report: { reporter: string; category: number; description: string; imageHash: string; gpsCoords: string; note: string }, 
  ai: { criticality: number; suggestedDept: number; estimatedSLAHours: number }
) {
  const provider = await getWeb3Provider();
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(INCIDENT_REGISTRY_ADDRESS, INCIDENT_REGISTRY_ABI, signer);
  const tx = await contract.stampIncident(incidentId, Object.values(report), Object.values(ai));
  return await tx.wait();
}

export async function createAssignmentOnChain(
  assignmentId: string,
  input: { vendorId: string; incidentId: string; slaHours: number; vendorRating: number }
) {
  const provider = await getWeb3Provider();
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(VENDOR_ASSIGNMENT_ADDRESS, VENDOR_ASSIGNMENT_ABI, signer);
  const tx = await contract.createAssignment(assignmentId, Object.values(input));
  return await tx.wait();
}

export async function createResolutionOnChain(
  resolutionId: string,
  input: { incidentId: string; assignmentId: string; vendorId: string; beforeImageHash: string; afterImageHash: string; costOfRepair: number; materialsUsed: string; completedAt: number }
) {
  const provider = await getWeb3Provider();
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(RESOLUTION_REGISTRY_ADDRESS, RESOLUTION_REGISTRY_ABI, signer);
  const tx = await contract.createResolution(resolutionId, Object.values(input));
  return await tx.wait();
}
