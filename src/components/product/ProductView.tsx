import React from 'react';
import { ArrowLeft, Package, MapPin, Clock, User, FileText, Shield, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAppStore } from '../../store/useAppStore';
import { formatTimestamp, formatAddress } from '../../lib/utils';

export const ProductView: React.FC = () => {
  const { selectedProduct, getProductCheckpoints, setSelectedProduct, setCurrentView } = useAppStore();
  
  if (!selectedProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No product selected</h3>
          <p className="text-gray-600 mb-6">Please select a product from the dashboard to view its details.</p>
          <Button onClick={() => setCurrentView('dashboard')}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }
  
  const checkpoints = getProductCheckpoints(selectedProduct.id);
  const sortedCheckpoints = [...checkpoints].sort((a, b) => a.timestamp - b.timestamp);
  
  const handleBack = () => {
    setSelectedProduct(null);
    setCurrentView('dashboard');
  };
  
  const getStatusColor = (status: typeof selectedProduct.status) => {
    switch (status) {
      case 'active': return 'info';
      case 'completed': return 'success';
      case 'flagged': return 'danger';
      default: return 'default';
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manufacturer': return 'bg-blue-100 text-blue-800';
      case 'warehouse': return 'bg-purple-100 text-purple-800';
      case 'shipper': return 'bg-orange-100 text-orange-800';
      case 'retailer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" onClick={handleBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h1>
          <p className="text-gray-600">Product tracking and verification</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
              <Badge variant={getStatusColor(selectedProduct.status)}>
                {selectedProduct.status}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{selectedProduct.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900">{selectedProduct.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Manufacturer</label>
                <p className="text-gray-900">{selectedProduct.manufacturer}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Batch Number</label>
                <p className="text-gray-900 font-mono">{selectedProduct.batchNumber}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-gray-900">{formatTimestamp(selectedProduct.createdAt)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Product ID</label>
                <p className="text-gray-900 font-mono text-sm break-all">{selectedProduct.id}</p>
              </div>
            </div>
          </Card>
          
          {/* QR Code */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
            <div className="text-center">
              <img
                src={selectedProduct.qrCode}
                alt="Product QR Code"
                className="w-32 h-32 mx-auto mb-4 border border-gray-200 rounded-lg"
              />
              <p className="text-sm text-gray-600 mb-4">
                Scan this code to view product history
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = `${selectedProduct.name}-QR.png`;
                  link.href = selectedProduct.qrCode;
                  link.click();
                }}
              >
                Download QR Code
              </Button>
            </div>
          </Card>
          
          {/* Authenticity Badge */}
          <Card>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Verified Authentic</h3>
              <p className="text-sm text-gray-600">
                This product has been verified on the BlockDAG blockchain
              </p>
            </div>
          </Card>
        </div>
        
        {/* Supply Chain Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Supply Chain Journey</h3>
              <span className="text-sm text-gray-500">
                {sortedCheckpoints.length} checkpoint{sortedCheckpoints.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {sortedCheckpoints.length > 0 ? (
              <div className="space-y-6">
                {sortedCheckpoints.map((checkpoint, index) => (
                  <div key={checkpoint.id} className="relative">
                    {/* Timeline line */}
                    {index < sortedCheckpoints.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      {/* Timeline dot */}
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-teal-600" />
                      </div>
                      
                      {/* Checkpoint details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{checkpoint.location.label}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(checkpoint.role)}`}>
                              {checkpoint.role}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTimestamp(checkpoint.timestamp)}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span>{checkpoint.handlerName}</span>
                            <span className="text-gray-400 ml-2">
                              ({formatAddress(checkpoint.handlerAddress)})
                            </span>
                          </div>
                          
                          {checkpoint.notes && (
                            <div className="flex items-start text-sm text-gray-600">
                              <FileText className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{checkpoint.notes}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center text-xs text-gray-400">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            <span className="font-mono">{checkpoint.transactionHash}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No checkpoints yet</h4>
                <p className="text-gray-600">
                  This product hasn't been scanned by any supply chain partners yet.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};