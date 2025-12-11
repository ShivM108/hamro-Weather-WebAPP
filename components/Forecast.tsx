import React from 'react';
import { ForecastData } from '../types';
import { WEEK_DAYS } from '../constants';
import { Sun } from 'lucide-react';

interface ForecastProps {
  forecast: ForecastData[];
  unit: 'metric' | 'imperial';
}

export const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
  // Helper to color code UV index
  const getUVColor = (uv: number) => {
    if (uv <= 2) return 'text-green-500 bg-green-100 dark:bg-green-900/30';
    if (uv <= 5) return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
    if (uv <= 7) return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
    if (uv <= 10) return 'text-red-500 bg-red-100 dark:bg-red-900/30';
    return 'text-purple-500 bg-purple-100 dark:bg-purple-900/30';
  };

  return (
    <div className="bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">5-Day Forecast</h3>
      <div className="space-y-4">
        {forecast.map((day) => {
          const date = new Date(day.dt * 1000);
          const dayName = WEEK_DAYS[date.getDay()];
          const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
          const uvStyle = day.uvIndex !== undefined ? getUVColor(day.uvIndex) : '';

          return (
            <div key={day.dt} className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-colors cursor-default group">
              <span className="w-16 sm:w-24 font-medium text-gray-700 dark:text-gray-200 truncate">{dayName}</span>
              
              <div className="flex items-center flex-1 justify-center sm:justify-start sm:pl-4">
                 <img src={iconUrl} alt="icon" className="w-8 h-8 sm:w-10 sm:h-10" />
                 <span className="text-sm text-gray-600 dark:text-gray-400 capitalize hidden sm:block ml-2">
                    {day.weather[0].main}
                 </span>
              </div>

              <div className="flex items-center justify-end gap-2 sm:gap-6 min-w-[120px] sm:min-w-[140px]">
                {/* UV Index Indicator */}
                {day.uvIndex !== undefined && (
                   <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${uvStyle}`} title={`UV Index: ${day.uvIndex.toFixed(1)}`}>
                     <Sun size={12} className="mr-1" />
                     <span>{day.uvIndex.toFixed(0)}</span>
                   </div>
                )}
                
                <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base">
                    <span className="font-bold text-gray-900 dark:text-white w-6 sm:w-8 text-right">{Math.round(day.main.temp_max)}°</span>
                    <span className="text-gray-500 dark:text-gray-400 w-6 sm:w-8 text-right">{Math.round(day.main.temp_min)}°</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};