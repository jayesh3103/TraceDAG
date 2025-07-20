import React, { useState } from 'react';
import { Search, Shield, FileText, Award, Leaf, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProductCard } from '../components/features/ProductCard';
import { JourneyTimeline } from '../components/features/JourneyTimeline';
import { DeFiPanel } from '../components/features/DeFiPanel';
import { Product } from '../types';
import { mockProducts } from '../data/mockData';
import { getSustainabilityBadge } from '../utils/sustainability';

export const CustomerView: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'journey' | 'documents' | 'defi'>('journey');

  const handleSearch = () => {
    if (!searchInput.trim()) {
      alert('Please enter a product ID or QR code');
      return;
    }

    const product = mockProducts.find(p => 
      p.id === searchInput ||
      p.qrCode === searchInput ||
      searchInput.includes(p.id)
    );

    if (product) {
      setSelectedProduct(product);
    } else {
      alert('Product not found. Please check the ID or QR code.');
    }
  };

  const featuredProducts = mockProducts.filter(p => p.status === 'verified');
  const sustainabilityBadge = selectedProduct ? getSustainabilityBadge(selectedProduct.sustainabilityScore) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Product Authenticity Checker
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Verify product authenticity and view complete supply chain journey
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="उत्पाद ID दर्ज करें (जैसे PROD-001) या QR कोड स्कैन करें"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} size="lg">
              <Search className="w-5 h-5 mr-2" />
              Verify Product
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              डेमो के लिए: "PROD-001" या "PROD-002" आज़माएं
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      {selectedProduct && (
        <div className="space-y-8">
          {/* Product Header */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProductCard product={selectedProduct} showDetails />
                </div>
                
                <div className="space-y-4">
                  {/* Authenticity Status */}
                  <div className={`p-4 rounded-lg ${
                    selectedProduct.status === 'verified' ? 'bg-green-50 dark:bg-green-900/20' :
                    selectedProduct.status === 'suspicious' ? 'bg-red-50 dark:bg-red-900/20' :
                    'bg-yellow-50 dark:bg-yellow-900/20'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className={`w-5 h-5 ${
                        selectedProduct.status === 'verified' ? 'text-green-600' :
                        selectedProduct.status === 'suspicious' ? 'text-red-600' :
                        'text-yellow-600'
                      }`} />
                      <span className="font-medium text-gray-900 dark:text-white">
                        Authenticity Status
                      </span>
                    </div>
                    <Badge variant={selectedProduct.status === 'verified' ? 'success' : 
                                  selectedProduct.status === 'suspicious' ? 'danger' : 'warning'}>
                      {selectedProduct.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Sustainability Score */}
                  {sustainabilityBadge && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Sustainability
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {selectedProduct.sustainabilityScore}/100
                        </span>
                        <Badge variant="success" className={sustainabilityBadge.color}>
                          {sustainabilityBadge.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Carbon footprint: {selectedProduct.carbonFootprint.toFixed(1)} kg CO₂
                      </p>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                        {selectedProduct.checkpoints.length}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        Checkpoints
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                        {selectedProduct.documents.length}
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">
                        Documents
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Card>
            <CardHeader>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('journey')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'journey'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Supply Chain Journey
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'documents'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Documents & Certificates
                </button>
                <button
                  onClick={() => setActiveTab('defi')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'defi'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  DeFi Options
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'journey' && (
                <JourneyTimeline checkpoints={selectedProduct.checkpoints} />
              )}
              
              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Product Documents
                  </h3>
                  
                  {selectedProduct.documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProduct.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-3">
                            <FileText className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {doc.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Type: {doc.type}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 break-all">
                                IPFS: {doc.ipfsHash}
                              </p>
                              <Button variant="outline" size="sm" className="mt-2">
                                View Document
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No documents available for this product</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'defi' && (
                <DeFiPanel product={selectedProduct} />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Featured Products */}
      {!selectedProduct && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Verified Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Browse products with verified authenticity
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};