import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationClick: () => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationClick, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="w-full h-12 pl-12 pr-12 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/40 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all text-gray-800 dark:text-white placeholder-gray-500"
          disabled={isLoading}
        />
        <Search className="absolute left-4 top-3.5 text-gray-500 dark:text-gray-400 w-5 h-5" />
        
        <button
          type="button"
          onClick={onLocationClick}
          className="absolute right-3 top-2.5 p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-500 transition-colors"
          title="Use current location"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};