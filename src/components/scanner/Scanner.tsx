import React, { useState } from 'react';
import { Camera, MapPin, Clock, User, FileText, Upload } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { QRScanner } from './QRScanner';
import { useAppStore } from '../../store/useAppStore';
import { getCurrentLocation, reverseGeocode, generateProductId } from '../../lib/utils';
import { Checkpoint } from '../../types';

export const Scanner: React.FC = () => {
  const { user, products, addCheckpoint, setError } = useAppStore();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    notes: '',
    role: 'warehouse' as Checkpoint['role'],
  });
  
  const handleScan = async (productId: string) => {
    setShowScanner(false);
    setScannedProduct(productId);
    
    // Auto-fill location
    try {
      const coords = await getCurrentLocation();
      const address = await reverseGeocode(coords.lat, coords.lng);
      setFormData(prev => ({ ...prev, location: address }));
    } catch (error) {
      console.warn('Could not get location:', error);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedProduct || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Get current location
      const coords = await getCurrentLocation();
      
      // Create checkpoint
      const checkpoint: Checkpoint = {
        id: generateProductId(),
        productId: scannedProduct,
        location: {
          lat: coords.lat,
          lng: coords.lng,
          address: formData.location,
          label: formData.location,
        },
        timestamp: Math.floor(Date.now() / 1000),
        blockNumber: Math.floor(Math.random() * 1000000), // Mock
        handlerAddress: user.address,
        handlerName: user.name,
        role: formData.role,
        notes: formData.notes || undefined,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock
      };
      
      addCheckpoint(checkpoint);
      
      // Reset form
      setScannedProduct(null);
      setFormData({ location: '', notes: '', role: 'warehouse' });
      
      // Show success message
      setError('Checkpoint added successfully!');
      setTimeout(() => setError(null), 3000);
      
    } catch (error) {
      setError('Failed to add checkpoint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const product = products.find(p => p.id === scannedProduct);
  
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkpoint Scanner</h1>
        <p className="text-gray-600">Scan a product QR code to add a new checkpoint</p>
      </div>
      
      {!scannedProduct ? (
        <Card className="text-center py-12">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Scan</h3>
          <p className="text-gray-600 mb-6">
            Tap the button below to open your camera and scan a product QR code
          </p>
          <Button
            size="lg"
            onClick={() => setShowScanner(true)}
            className="flex items-center space-x-2"
          >
            <Camera className="w-5 h-5" />
            <span>Scan QR Code</span>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
            {product ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Product Name:</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Batch Number:</span>
                  <span className="font-medium">{product.batchNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={product.status === 'active' ? 'info' : 'success'}>
                    {product.status}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">Product not found in local database</p>
                <p className="text-sm text-gray-500 mt-1">ID: {scannedProduct}</p>
              </div>
            )}
          </Card>
          
          {/* Checkpoint Form */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Checkpoint</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location or address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Your Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as Checkpoint['role'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="warehouse">Warehouse</option>
                  <option value="shipper">Shipper</option>
                  <option value="retailer">Retailer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes or comments"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="flex-1"
                >
                  Add Checkpoint
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setScannedProduct(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      
      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};