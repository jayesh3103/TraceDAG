import React, { useState } from 'react';
import { Package, Download, QrCode, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { generateProductId } from '../../lib/utils';
import { Product } from '../../types';
import QRCode from 'qrcode';

export const ManufacturerDashboard: React.FC = () => {
  const { user, addProduct, setError } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    batchNumber: '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsCreating(true);
    
    try {
      const productId = generateProductId();
      
      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(productId, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0D1B2A',
          light: '#FFFFFF',
        },
      });
      
      const product: Product = {
        id: productId,
        tokenId: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock
        name: formData.name,
        description: formData.description,
        manufacturer: user.company || user.name,
        batchNumber: formData.batchNumber,
        createdAt: Math.floor(Date.now() / 1000),
        qrCode: qrCodeDataUrl,
        status: 'active',
      };
      
      addProduct(product);
      
      // Reset form
      setFormData({ name: '', description: '', batchNumber: '' });
      
      // Show success message
      setError('Product created successfully!');
      setTimeout(() => setError(null), 3000);
      
    } catch (error) {
      setError('Failed to create product. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };
  
  const downloadQRCode = (product: Product) => {
    const link = document.createElement('a');
    link.download = `${product.name}-QR.png`;
    link.href = product.qrCode;
    link.click();
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Manufacturer Dashboard</h1>
        <p className="text-gray-600">Create and manage your products on the blockchain</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Product Form */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Create New Product
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your product"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Number
              </label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                placeholder="Enter batch number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            
            <Button
              type="submit"
              loading={isCreating}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Create Product & Mint NFT</span>
            </Button>
          </form>
        </Card>
        
        {/* Instructions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How it Works</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-teal-600">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Create Product</h4>
                <p className="text-sm text-gray-600">Fill in the product details and batch information</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-teal-600">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Mint NFT</h4>
                <p className="text-sm text-gray-600">A unique NFT is created on the BlockDAG chain</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-teal-600">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Generate QR Code</h4>
                <p className="text-sm text-gray-600">Download and attach the QR code to your product</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-teal-600">4</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Track Journey</h4>
                <p className="text-sm text-gray-600">Partners scan the code to add checkpoints</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};