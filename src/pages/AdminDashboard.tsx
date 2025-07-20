import React, { useState } from 'react';
import { Search, Filter, TrendingUp, AlertTriangle, Shield, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ProductCard } from '../components/features/ProductCard';
import { JourneyTimeline } from '../components/features/JourneyTimeline';
import { Product } from '../types';
import { mockProducts } from '../data/mockData';

export const AdminDashboard: React.FC = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const productDate = new Date(product.createdAt);
      const now = new Date();
      switch (dateFilter) {
        case 'today': return productDate.toDateString() === now.toDateString();
        case 'week': return (now.getTime() - productDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        case 'month': return (now.getTime() - productDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        default: return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Analytics calculations
  const stats = {
    total: products.length,
    verified: products.filter(p => p.status === 'verified').length,
    suspicious: products.filter(p => p.status === 'suspicious').length,
    pending: products.filter(p => p.status === 'pending').length,
    totalCheckpoints: products.reduce((sum, p) => sum + p.checkpoints.length, 0),
    avgSustainability: Math.round(products.reduce((sum, p) => sum + p.sustainabilityScore, 0) / products.length),
  };

  // AI Anomaly Detection (mock)
  const anomalies = [
    {
      id: 'ANOM-001',
      productId: 'PROD-002',
      type: 'Missing Checkpoint',
      description: 'Expected checkpoint in transit phase missing',
      severity: 'high',
      timestamp: '2024-01-20T10:30:00Z',
    },
    {
      id: 'ANOM-002',
      productId: 'PROD-001',
      type: 'Unusual Delay',
      description: 'Checkpoint logged 48 hours later than expected',
      severity: 'medium',
      timestamp: '2024-01-19T15:45:00Z',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor supply chain operations and product analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Verified Products
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.verified}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Suspicious Products
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.suspicious}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg. Sustainability
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.avgSustainability}/100
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Anomaly Detection */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            AI Anomaly Detection
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className={`p-4 rounded-lg border-l-4 ${
                  anomaly.severity === 'high' 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {anomaly.type}
                      </h3>
                      <Badge variant={anomaly.severity === 'high' ? 'danger' : 'warning'}>
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Product: {anomaly.productId}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      {anomaly.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(anomaly.timestamp).toLocaleString()}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Investigate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Product name, ID, or manufacturer"
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="suspicious">Suspicious</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Filter
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Products ({filteredProducts.length})
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard 
                  product={product} 
                  onClick={() => setSelectedProduct(product)}
                  showDetails
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No products found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`Product Details - ${selectedProduct.name}`}
          size="xl"
        >
          <div className="space-y-6">
            <ProductCard product={selectedProduct} showDetails />
            <JourneyTimeline checkpoints={selectedProduct.checkpoints} />
          </div>
        </Modal>
      )}
    </div>
  );
};