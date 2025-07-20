export const calculateSustainabilityScore = (checkpoints: any[]): number => {
  // Mock calculation based on distance, transport methods, etc.
  const baseScore = 100;
  const checkpointCount = checkpoints.length;
  const distancePenalty = checkpointCount * 2; // Simplified distance calculation
  
  return Math.max(60, Math.min(100, baseScore - distancePenalty + Math.random() * 10));
};

export const calculateCarbonFootprint = (checkpoints: any[]): number => {
  // Mock carbon footprint calculation in kg CO2
  const baseFootprint = 5;
  const transportFootprint = checkpoints.length * 3;
  
  return Math.max(1, baseFootprint + transportFootprint + Math.random() * 5);
};

export const getSustainabilityBadge = (score: number): { label: string; color: string } => {
  if (score >= 90) return { label: 'Excellent', color: 'bg-green-500' };
  if (score >= 80) return { label: 'Good', color: 'bg-blue-500' };
  if (score >= 70) return { label: 'Fair', color: 'bg-yellow-500' };
  return { label: 'Poor', color: 'bg-red-500' };
};