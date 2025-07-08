import React from 'react';
import { Package, Scan, User, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { formatAddress } from '../../lib/utils';

export const Header: React.FC = () => {
  const { user, isConnected, currentView, setCurrentView } = useAppStore();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Package },
    { id: 'scanner', label: 'Scanner', icon: Scan },
    { id: 'manufacturer', label: 'Manufacturer', icon: User },
  ] as const;
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-navy-900">TraceDAG</h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === id
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          
          {/* User section */}
          <div className="flex items-center space-x-4">
            {isConnected && user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{formatAddress(user.address)}</p>
                </div>
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-teal-600" />
                </div>
              </div>
            ) : (
              <Button size="sm">Connect Wallet</Button>
            )}
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};