import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = true 
}) => {
  return (
    <div className={`
      bg-white/60 dark:bg-gray-800/60 
      backdrop-blur-lg 
      rounded-2xl 
      shadow-xl 
      border border-gray-200/50 dark:border-gray-700/50
      ${hover ? 'hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-out' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export const GlassCardHeader: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200/30 dark:border-gray-700/30 ${className}`}>
      {children}
    </div>
  );
};

export const GlassCardContent: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};