import React, { useState } from 'react';
import { Plus, Upload, Coins, QrCode, Package, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { QRCodeDisplay } from '../components/features/QRCodeDisplay';
import { Product } from '../types';
import { mockProducts } from '../data/mockData';
import { generateTokenId, generateQRCode, simulateBlockchainTransaction } from '../utils/blockchain';
import { calculateSustainabilityScore, calculateCarbonFootprint } from '../utils/sustainability';

export const ManufacturerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    batchId: '',
    manufactureDate: '',
    manufacturer: 'Patanjali Ayurved',
    documents: [] as File[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ 
        ...prev, 
        documents: Array.from(e.target.files || [])
      }));
    }
  };

  const handleMintToken = async () => {
    if (!formData.name || !formData.batchId || !formData.manufactureDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate blockchain transaction
      const transactionHash = await simulateBlockchainTransaction(formData);
      
      const newProduct: Product = {
        id: `PROD-${Date.now()}`,
        name: formData.name,
        batchId: formData.batchId,
        manufactureDate: formData.manufactureDate,
        manufacturer: formData.manufacturer || 'Patanjali Ayurved',
        tokenId: generateTokenId(),
        qrCode: generateQRCode(`PROD-${Date.now()}`),
        status: 'verified',
        documents: formData.documents.map((file, index) => ({
          id: `DOC-${Date.now()}-${index}`,
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file),
          ipfsHash: `Qm${Math.random().toString(36).substr(2, 44)}`,
        })),
        sustainabilityScore: calculateSustainabilityScore([]),
        carbonFootprint: calculateCarbonFootprint([]),
        checkpoints: [{
          id: `CP-${Date.now()}`,
          productId: `PROD-${Date.now()}`,
          location: 'Factory - Manufacturing Floor',
          location: 'Manufacturing Unit - MIDC Industrial Area, Haridwar, Uttarakhand',
          timestamp: new Date().toISOString(),
          handler: formData.manufacturer || 'Patanjali Ayurved',
          notes: 'Product manufactured and tokenized',
          transactionHash,
        }],
        createdAt: new Date().toISOString(),
      };

      setProducts(prev => [newProduct, ...prev]);
      setFormData({
        name: '',
        batchId: '',
        manufactureDate: '',
        manufacturer: 'Patanjali Ayurved',
        documents: [],
      });
      
      // Show QR code modal
      setSelectedProduct(newProduct);
      setIsModalOpen(false);
      
    } catch (error) {
      alert('Error minting token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manufacturer Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Register new products and mint blockchain tokens for supply chain tracking
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tokens Minted
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.filter(p => p.tokenId).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <QrCode className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  QR Codes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.filter(p => p.qrCode).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Documents
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.reduce((sum, p) => sum + p.documents.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="mb-8">
        <Button onClick={() => setIsModalOpen(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Register New Product
        </Button>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Products
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Batch: {product.batchId} • Token: {product.tokenId}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge variant={product.status === 'verified' ? 'success' : 'warning'}>
                    {product.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Registration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Product"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Organic Turmeric Powder"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Batch ID *
              </label>
              <input
                type="text"
                name="batchId"
                value={formData.batchId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., TUR-2024-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Manufacture Date *
              </label>
              <input
                type="date"
                name="manufactureDate"
                value={formData.manufactureDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Manufacturer
              </label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Documents
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Upload documents
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    FSSAI License, GST Invoice, Quality Certificates, etc.
                  </p>
                </div>
              </div>
              
              {formData.documents.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Selected files:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.documents.map((file, index) => (
                      <li key={index}>• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMintToken} loading={isLoading}>
              <Coins className="w-4 h-4 mr-2" />
              Mint Token & Generate QR
            </Button>
          </div>
        </div>
      </Modal>

      {/* QR Code Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`QR Code - ${selectedProduct.name}`}
          size="md"
        >
          <div className="text-center">
            <QRCodeDisplay 
              value={selectedProduct.qrCode}
              title={`${selectedProduct.name} (${selectedProduct.id})`}
            />
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Token ID: {selectedProduct.tokenId}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: <span className="font-medium">{selectedProduct.status}</span>
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};