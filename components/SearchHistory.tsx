import React from 'react';
import { Clock, Trash2 } from 'lucide-react';

interface SearchHistoryProps {
  history: string[];
  onSelect: (city: string) => void;
  onClear: () => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/20 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Recent</h3>
        <button onClick={onClear} className="text-gray-500 hover:text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((city, index) => (
          <button
            key={index}
            onClick={() => onSelect(city)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/40 dark:bg-black/30 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 rounded-lg text-sm transition-all duration-200 text-gray-700 dark:text-gray-200"
          >
            <Clock size={12} />
            <span>{city}</span>
          </button>
        ))}
      </div>
    </div>
  );
};