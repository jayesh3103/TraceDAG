import React from 'react';
import { User, TrendingUp, Package, Clock } from 'lucide-react';

interface WelcomeHeaderProps {
  userName?: string;
  role?: string;
  stats?: {
    productsCreated?: number;
    checkpointsToday?: number;
    alertsTriggered?: number;
  };
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ 
  userName = 'राजेश कुमार',
  role = 'Customer',
  stats = {}
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickStats = [
    {
      label: 'Products Created',
      value: stats.productsCreated || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Checkpoints Today',
      value: stats.checkpointsToday || 0,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Alerts Triggered',
      value: stats.alertsTriggered || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-2xl mb-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {getGreeting()}, {userName}! 👋
              </h1>
              <p className="text-blue-100">
                {role} Dashboard • {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex space-x-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[120px]">
              <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};