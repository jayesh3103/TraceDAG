import React from 'react';
import { QrCode, Plus, Camera } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: 'scan' | 'add' | 'camera';
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick, 
  icon = 'scan',
  className = '' 
}) => {
  const Icon = icon === 'scan' ? QrCode : icon === 'camera' ? Camera : Plus;

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 backdrop-blur-sm ${className}`}
    >
      <Icon className="w-6 h-6 mx-auto" />
      <div className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-75"></div>
    </button>
  );
};