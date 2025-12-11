import React from 'react';
import { CloudSun, Moon, Sun, Thermometer } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  unit: 'metric' | 'imperial';
  setUnit: (value: 'metric' | 'imperial') => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, unit, setUnit }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg">
      <div className="flex items-center space-x-3 mb-4 sm:mb-0">
        <div className="p-2 bg-blue-500 rounded-lg text-white shadow-lg">
          <CloudSun size={28} />
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300">
          Hamro Weather
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Unit Toggle */}
        <button
          onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium dark:text-white text-gray-700"
          aria-label="Toggle Unit"
        >
          <Thermometer size={16} />
          <span>{unit === 'metric' ? '°C' : '°F'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all transform hover:scale-105 dark:text-yellow-300 text-slate-700"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};