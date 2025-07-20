import React from 'react';
import { QrCode, Calendar, MapPin, Shield, Leaf, Zap } from 'lucide-react';
import { Product } from '../../types';
import { GlassCard, GlassCardContent } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { getSustainabilityBadge } from '../../utils/sustainability';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  showDetails?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onClick, 
  showDetails = false 
}) => {
  const statusVariant = {
    verified: 'success',
    suspicious: 'danger',
    pending: 'warning',
  } as const;

  const sustainabilityBadge = getSustainabilityBadge(product.sustainabilityScore);

  return (
    <GlassCard className={`cursor-pointer group ${
      product.status === 'verified' ? 'ring-2 ring-green-200 dark:ring-green-800' :
      product.status === 'suspicious' ? 'ring-2 ring-red-200 dark:ring-red-800' :
      'ring-2 ring-yellow-200 dark:ring-yellow-800'
    }`} onClick={onClick}>
      <GlassCardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ID: {product.id}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={statusVariant[product.status]} size="sm">
              <Shield className="w-3 h-3 mr-1" />
              {product.status}
            </Badge>
            <QrCode className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(product.manufactureDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            {product.checkpoints.length} checkpoints
          </div>
        </div>

        {/* Sustainability Indicators */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Leaf className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Sustainability: {product.sustainabilityScore}/100
            </span>
            <Badge variant="success" size="sm" className={sustainabilityBadge.color}>
              {sustainabilityBadge.label}
            </Badge>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
            <Zap className="w-4 h-4 text-orange-500" />
            <span>{product.carbonFootprint.toFixed(1)} kg CO₂</span>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Latest Checkpoint:
              </p>
              {product.checkpoints.length > 0 ? (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p>{product.checkpoints[product.checkpoints.length - 1].location}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(product.checkpoints[product.checkpoints.length - 1].timestamp).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No checkpoints recorded</p>
              )}
            </div>
          </div>
        )}
      </GlassCardContent>
    </GlassCard>
  );
};