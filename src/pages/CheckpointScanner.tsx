import React, { useState } from 'react';
import { QrCode, MapPin, Clock, User, FileText, Scan, AlertCircle, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ProductCard } from '../components/features/ProductCard';
import { QRScanner } from '../components/features/QRScanner';
import { Product, Checkpoint } from '../types';
import { mockProducts } from '../data/mockData';
import { simulateBlockchainTransaction } from '../utils/blockchain';

export const CheckpointScanner: React.FC = () => {
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    handler: '',
    notes: '',
  });

  // Listen for FAB click to open scanner
  React.useEffect(() => {
    const handleOpenScanner = () => setShowScanner(true);
    window.addEventListener('openQRScanner', handleOpenScanner);
    return () => window.removeEventListener('openQRScanner', handleOpenScanner);
  }, []);

  const handleQRScan = (qrValue?: string) => {
    const scanValue = qrValue || qrInput;
    
    if (!scanValue.trim()) {
      alert('Please enter a QR code value');
      return;
    }

    // Find product by QR code (mock)
    const product = mockProducts.find(p => 
      p.qrCode === scanValue || 
      p.id === scanValue ||
      scanValue.includes(p.id)
    );

    if (product) {
      setScannedProduct(product);
      setFormData({
        location: '',
        handler: 'Swift Logistics',
        notes: '',
      });
    } else {
      alert(`Product not found for: ${scanValue}. Please check the QR code.`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitCheckpoint = async () => {
    if (!formData.location || !formData.handler) {
      alert('Please fill in required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate blockchain transaction
      const transactionHash = await simulateBlockchainTransaction({
        productId: scannedProduct?.id,
        ...formData,
      });

      const newCheckpoint: Checkpoint = {
        id: `CP-${Date.now()}`,
        productId: scannedProduct!.id,
        location: formData.location,
        timestamp: new Date().toISOString(),
        handler: formData.handler,
        notes: formData.notes || undefined,
        transactionHash,
        coordinates: {
          lat: 40.7128 + (Math.random() - 0.5) * 10,
          lng: -74.0060 + (Math.random() - 0.5) * 10,
        },
      };

      // In a real app, this would update the backend
      console.log('New checkpoint added:', newCheckpoint);
      
      setIsModalOpen(false);
      setScannedProduct(null);
      setQrInput('');
      setFormData({ location: '', handler: '', notes: '' });
      
      alert('Checkpoint successfully logged on blockchain!');
      
    } catch (error) {
      alert('Error logging checkpoint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const recentScans = mockProducts.slice(0, 3); // Mock recent scans

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Checkpoint Scanner
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Scan QR codes to log product checkpoints and update journey status
        </p>
      </div>

      {/* Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              QR Code Scanner
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                QR Code or Product ID
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  placeholder="QR-PROD-001 or PROD-001"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <Button onClick={handleQRScan}>
                  <Scan className="w-4 h-4 mr-1" />
                  Search
                </Button>
                <Button onClick={() => setShowScanner(true)} variant="outline">
                  <Camera className="w-4 h-4 mr-1" />
                  Scan
                </Button>
              </div>
            </div>

            {/* Camera Scanner Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Camera className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Camera QR Scanner Ready
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Click "Scan" to use your camera for QR code detection
              </p>
              <Button onClick={() => setShowScanner(true)} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Open Camera Scanner
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                💡 For demo: try "PROD-001", "PROD-002", or manual input
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              How to Use
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Scan QR Code
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use the camera or enter the QR code manually
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Review Product
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Verify product details and authenticity
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Log Checkpoint
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add location, handler, and notes
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Blockchain Update
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Submit to blockchain for verification
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scanned Product */}
      {scannedProduct && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Scanned Product
              </h2>
              <Button onClick={() => setIsModalOpen(true)}>
                <MapPin className="w-4 h-4 mr-2" />
                Log Checkpoint
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ProductCard product={scannedProduct} showDetails />
          </CardContent>
        </Card>
      )}

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Scans
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentScans.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onClick={() => setScannedProduct(product)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Checkpoint Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log New Checkpoint"
        size="lg"
      >
        {scannedProduct && (
          <div className="space-y-6">
            {/* Product Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {scannedProduct.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>ID: {scannedProduct.id}</span>
                <Badge variant={scannedProduct.status === 'verified' ? 'success' : 'warning'}>
                  {scannedProduct.status}
                </Badge>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Warehouse B - New York, NY"
                  placeholder="e.g., Distribution Center - Bhiwandi, Maharashtra"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Handler Name *
                </label>
                <input
                  type="text"
                  name="handler"
                  value={formData.handler}
                  onChange={handleInputChange}
                  placeholder="e.g., John Smith - Swift Logistics"
                  placeholder="e.g., Rajesh Kumar - VRL Logistics"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Additional information about this checkpoint..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Timestamp</span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitCheckpoint} loading={isLoading}>
                Submit to Blockchain
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleQRScan}
        title="Scan Product QR Code"
        subtitle="Position the QR code within the camera frame"
      />
    </div>
  );
};