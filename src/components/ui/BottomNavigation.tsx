import React from 'react';
import { Package, QrCode, Search, Settings, Home } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  currentPage, 
  onPageChange 
}) => {
  const navigation = [
    { name: 'Home', page: 'customer', icon: Home },
    { name: 'Scan', page: 'scanner', icon: QrCode },
    { name: 'Products', page: 'manufacturer', icon: Package },
    { name: 'Admin', page: 'admin', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-4 h-16">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          
          return (
            <button
              key={item.name}
              onClick={() => onPageChange(item.page)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 transform scale-110'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium">{item.name}</span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};