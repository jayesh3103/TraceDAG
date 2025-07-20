import React, { useState } from 'react';
import { Menu, X, Moon, Sun, Package, Search, Globe } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const { isDark, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Manufacturer', page: 'manufacturer' },
    { name: 'Scanner', page: 'scanner' },
    { name: 'Customer View', page: 'customer' },
    { name: 'Admin', page: 'admin' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  ];

  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        manufacturer: 'Manufacturer',
        scanner: 'Scanner',
        customer: 'Customer View',
        admin: 'Admin',
      },
      hi: {
        manufacturer: 'निर्माता',
        scanner: 'स्कैनर',
        customer: 'ग्राहक दृश्य',
        admin: 'व्यवस्थापक',
      },
    };
    return translations[language]?.[key] || key;
  };
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative">
              <Package className="h-8 w-8 text-blue-600 animate-pulse" />
              <div className="absolute inset-0 h-8 w-8 text-blue-400 animate-ping opacity-20">
                <Package className="h-8 w-8" />
              </div>
            </div>
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TraceDAG
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => onPageChange(item.page)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentPage === item.page
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {getLocalizedText(item.page)}
              </button>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                className="p-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <Globe className="h-4 w-4 mr-1" />
                {languages.find(l => l.code === language)?.flag}
              </Button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                      language === lang.code ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="p-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:scale-110 transition-transform duration-200"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/30 dark:border-gray-700/30 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onPageChange(item.page);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 ${
                    currentPage === item.page
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {getLocalizedText(item.page)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};