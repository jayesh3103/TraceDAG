export interface Product {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  manufacturer: string;
  batchNumber: string;
  createdAt: number;
  qrCode: string;
  status: 'active' | 'completed' | 'flagged';
}

export interface Checkpoint {
  id: string;
  productId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    label: string;
  };
  timestamp: number;
  blockNumber: number;
  handlerAddress: string;
  handlerName: string;
  role: 'manufacturer' | 'warehouse' | 'shipper' | 'retailer' | 'other';
  notes?: string;
  documents?: string[]; // IPFS hashes
  transactionHash: string;
}

export interface User {
  address: string;
  name: string;
  role: 'manufacturer' | 'logistics' | 'consumer' | 'auditor';
  company?: string;
  verified: boolean;
}

export interface ContractEvent {
  type: 'ProductMinted' | 'CheckpointAdded' | 'StatusUpdated';
  productId: string;
  data: any;
  blockNumber: number;
  timestamp: number;
}