import { ethers } from 'ethers';

export const INCIDENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_INCIDENT_REGISTRY_ADDRESS || "";
export const VENDOR_ASSIGNMENT_ADDRESS = process.env.NEXT_PUBLIC_VENDOR_ASSIGNMENT_ADDRESS || "";
export const RESOLUTION_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_RESOLUTION_REGISTRY_ADDRESS || "";
export const POLYGON_RPC_URL = process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "";

export const INCIDENT_REGISTRY_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AccessControlBadConfirmation",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "neededRole",
				"type": "bytes32"
			}
		],
		"name": "AccessControlUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "incidentId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "exportedBy",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "AuditExported",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "incidentId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "reporter",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "stamper",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum IncidentRegistry.IncidentCategory",
				"name": "category",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "enum IncidentRegistry.Criticality",
				"name": "criticality",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "enum IncidentRegistry.Department",
				"name": "suggestedDept",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "estimatedSLAHours",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "gpsCoords",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "imageHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stampedAt",
				"type": "uint256"
			}
		],
		"name": "IncidentStamped",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "previousAdminRole",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newAdminRole",
				"type": "bytes32"
			}
		],
		"name": "RoleAdminChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "AUDITOR_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DEFAULT_ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "STAMPER_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "incidentId",
				"type": "string"
			}
		],
		"name": "emitAuditRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "incidentId",
				"type": "string"
			}
		],
		"name": "getIncident",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "incidentId",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "reporter",
						"type": "address"
					},
					{
						"internalType": "enum IncidentRegistry.IncidentCategory",
						"name": "category",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "imageHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "gpsCoords",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "note",
						"type": "string"
					},
					{
						"internalType": "enum IncidentRegistry.Criticality",
						"name": "criticality",
						"type": "uint8"
					},
					{
						"internalType": "enum IncidentRegistry.Department",
						"name": "suggestedDept",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "estimatedSLAHours",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "stamper",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "stampedAt",
						"type": "uint256"
					}
				],
				"internalType": "struct IncidentRegistry.Incident",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getIncidentIdAt",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "getRoleAdmin",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "hasRole",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "incidentId",
				"type": "string"
			}
		],
		"name": "isStamped",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "callerConfirmation",
				"type": "address"
			}
		],
		"name": "renounceRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "incidentId",
				"type": "string"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "reporter",
						"type": "address"
					},
					{
						"internalType": "enum IncidentRegistry.IncidentCategory",
						"name": "category",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "imageHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "gpsCoords",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "note",
						"type": "string"
					}
				],
				"internalType": "struct IncidentRegistry.ResidentReport",
				"name": "report",
				"type": "tuple"
			},
			{
				"components": [
					{
						"internalType": "enum IncidentRegistry.Criticality",
						"name": "criticality",
						"type": "uint8"
					},
					{
						"internalType": "enum IncidentRegistry.Department",
						"name": "suggestedDept",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "estimatedSLAHours",
						"type": "uint256"
					}
				],
				"internalType": "struct IncidentRegistry.AIAssessment",
				"name": "ai",
				"type": "tuple"
			}
		],
		"name": "stampIncident",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalIncidents",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export const VENDOR_ASSIGNMENT_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AccessControlBadConfirmation",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "neededRole",
				"type": "bytes32"
			}
		],
		"name": "AccessControlUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "assignmentId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "incidentId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "vendorId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "slaHours",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "slaDeadline",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "vendorRating",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "stamper",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			}
		],
		"name": "AssignmentCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "assignmentId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "exportedBy",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "AuditExported",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "previousAdminRole",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newAdminRole",
				"type": "bytes32"
			}
		],
		"name": "RoleAdminChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "AUDITOR_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DEFAULT_ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "STAMPER_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "assignmentId",
				"type": "string"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "vendorId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "incidentId",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "slaHours",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "vendorRating",
						"type": "uint256"
					}
				],
				"internalType": "struct VendorAssignment.AssignmentInput",
				"name": "input",
				"type": "tuple"
			}
		],
		"name": "createAssignment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "assignmentId",
				"type": "string"
			}
		],
		"name": "emitAuditRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "assignmentId",
				"type": "string"
			}
		],
		"name": "getAssignment",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "assignmentId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "vendorId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "incidentId",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "slaHours",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "slaDeadline",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "vendorRating",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "stamper",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					}
				],
				"internalType": "struct VendorAssignment.Assignment",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "incidentId",
				"type": "string"
			}
		],
		"name": "getAssignmentByIncident",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getAssignmentIdAt",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "getRoleAdmin",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "hasRole",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "incidentId",
				"type": "string"
			}
		],
		"name": "isIncidentAssigned",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "assignmentId",
				"type": "string"
			}
		],
		"name": "isSLABreached",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "callerConfirmation",
				"type": "address"
			}
		],
		"name": "renounceRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalAssignments",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export const RESOLUTION_REGISTRY_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AccessControlBadConfirmation",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "neededRole",
				"type": "bytes32"
			}
		],
		"name": "AccessControlUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "resolutionId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "exportedBy",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "AuditExported",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "resolutionId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "incidentId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "assignmentId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "vendorId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "beforeImageHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "afterImageHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "costOfRepair",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "completedAt",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "stamper",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stampedAt",
				"type": "uint256"
			}
		],
		"name": "ResolutionStamped",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "previousAdminRole",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newAdminRole",
				"type": "bytes32"
			}
		],
		"name": "RoleAdminChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "AUDITOR_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DEFAULT_ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "STAMPER_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "resolutionId",
				"type": "string"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "incidentId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "assignmentId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "vendorId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "beforeImageHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "afterImageHash",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "costOfRepair",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "materialsUsed",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "completedAt",
						"type": "uint256"
					}
				],
				"internalType": "struct ResolutionRegistry.ResolutionInput",
				"name": "input",
				"type": "tuple"
			}
		],
		"name": "createResolution",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "resolutionId",
				"type": "string"
			}
		],
		"name": "emitAuditRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "resolutionId",
				"type": "string"
			}
		],
		"name": "getResolution",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "resolutionId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "incidentId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "assignmentId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "vendorId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "beforeImageHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "afterImageHash",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "costOfRepair",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "materialsUsed",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "completedAt",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "stamper",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "stampedAt",
						"type": "uint256"
					}
				],
				"internalType": "struct ResolutionRegistry.Resolution",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "incidentId",
				"type": "string"
			}
		],
		"name": "getResolutionByIncident",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getResolutionIdAt",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "getRoleAdmin",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "hasRole",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "incidentId",
				"type": "string"
			}
		],
		"name": "isIncidentResolved",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "callerConfirmation",
				"type": "address"
			}
		],
		"name": "renounceRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalResolutions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export async function getWeb3Provider() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  throw new Error("No crypto wallet found. Please install MetaMask or another Web3 wallet.");
}
