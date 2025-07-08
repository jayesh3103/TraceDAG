import React from 'react';
import { Plus, Search, Filter, TrendingUp, Package, MapPin, Users } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProductCard } from './ProductCard';
import { useAppStore } from '../../store/useAppStore';

export const Dashboard: React.FC = () => {
  const { products, checkpoints, user, setCurrentView } = useAppStore();
  
  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Active Shipments',
      value: products.filter(p => p.status === 'active').length,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Checkpoints',
      value: checkpoints.length,
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Partners',
      value: 12, // Mock data
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supply Chain Dashboard</h1>
          <p className="text-gray-600 mt-1">Track and manage your products across the supply chain</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setCurrentView('scanner')}
            className="flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Scan Product</span>
          </Button>
          <Button
            onClick={() => setCurrentView('manufacturer')}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Product</span>
          </Button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </Card>
        ))}
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>
      
      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first product or scanning an existing one.</p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => setCurrentView('manufacturer')}>
              Create Product
            </Button>
            <Button variant="outline" onClick={() => setCurrentView('scanner')}>
              Scan QR Code
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};