import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Badge } from './Badge';

interface FilterTag {
  id: string;
  label: string;
  value: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FilterTag[];
  onFilterToggle: (filterId: string) => void;
  activeFilters: string[];
  placeholder?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchValue,
  onSearchChange,
  filters,
  onFilterToggle,
  activeFilters,
  placeholder = 'Search...',
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const clearAllFilters = () => {
    activeFilters.forEach(filterId => onFilterToggle(filterId));
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
            showFilters || activeFilters.length > 0
              ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {activeFilters.map(filterId => {
            const filter = filters.find(f => f.id === filterId);
            if (!filter) return null;
            
            return (
              <Badge
                key={filterId}
                variant="info"
                className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                onClick={() => onFilterToggle(filterId)}
              >
                {filter.label}
                <X className="w-3 h-3 ml-1 group-hover:text-red-600" />
              </Badge>
            );
          })}
          <button
            onClick={clearAllFilters}
            className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 animate-in slide-in-from-top-2 duration-200">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Filter by:</h3>
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => onFilterToggle(filter.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilters.includes(filter.id)
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};