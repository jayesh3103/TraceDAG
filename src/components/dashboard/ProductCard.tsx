import React from 'react';
import { Package, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Product } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { formatTimestamp } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, setCurrentView, getProductCheckpoints } = useAppStore();
  const checkpoints = getProductCheckpoints(product.id);
  
  const handleViewDetails = () => {
    setSelectedProduct(product);
    setCurrentView('product');
  };
  
  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active': return 'info';
      case 'completed': return 'success';
      case 'flagged': return 'danger';
      default: return 'default';
    }
  };
  
  return (
    <Card hover className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.batchNumber}</p>
          </div>
        </div>
        <Badge variant={getStatusColor(product.status)}>
          {product.status}
        </Badge>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-2" />
          Created {formatTimestamp(product.createdAt)}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-2" />
          {checkpoints.length} checkpoint{checkpoints.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400 font-mono">{product.id}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleViewDetails}
          className="flex items-center space-x-1"
        >
          <span>View Details</span>
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
};