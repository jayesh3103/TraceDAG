export interface Product {
  id: string;
  name: string;
  batchId: string;
  manufactureDate: string;
  manufacturer: string;
  tokenId: string;
  qrCode: string;
  status: 'verified' | 'suspicious' | 'pending';
  documents: Document[];
  sustainabilityScore: number;
  carbonFootprint: number;
  checkpoints: Checkpoint[];
  createdAt: string;
}

export interface Checkpoint {
  id: string;
  productId: string;
  location: string;
  timestamp: string;
  handler: string;
  notes?: string;
  transactionHash: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  ipfsHash: string;
}

export interface User {
  id: string;
  name: string;
  role: 'manufacturer' | 'logistics' | 'retailer' | 'customer' | 'admin';
  company?: string;
}

export interface DeFiLoan {
  id: string;
  productId: string;
  amount: number;
  interestRate: number;
  duration: number;
  status: 'active' | 'completed' | 'defaulted';
  collateralValue: number;
}