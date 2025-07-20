// Mock blockchain utilities
export const generateTokenId = (): string => {
  return `NFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateTransactionHash = (): string => {
  return `0x${Math.random().toString(16).substr(2, 64)}`;
};

export const generateQRCode = (productId: string): string => {
  return `QR-${productId}-${Math.random().toString(36).substr(2, 6)}`;
};

export const simulateBlockchainTransaction = async (data: any): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  return generateTransactionHash();
};

export const validateProductAuthenticity = (product: any): 'verified' | 'suspicious' | 'pending' => {
  // Simple mock validation logic
  const hasAllCheckpoints = product.checkpoints && product.checkpoints.length > 0;
  const hasDocuments = product.documents && product.documents.length > 0;
  const recentActivity = product.checkpoints?.some((cp: any) => 
    new Date(cp.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  if (hasAllCheckpoints && hasDocuments && recentActivity) {
    return 'verified';
  } else if (!hasAllCheckpoints || !recentActivity) {
    return 'suspicious';
  }
  return 'pending';
};