import React from 'react';
import { ForecastData } from '../types';
import { WEEK_DAYS } from '../constants';
import { Sun, Activity } from 'lucide-react';

interface ForecastProps {
  forecast: ForecastData[];
  unit: 'metric' | 'imperial';
}

export const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
  // Helper to color code UV index
  const getUVColor = (uv: number) => {
    if (uv <= 2) return 'text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-200';
    if (uv <= 5) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40 dark:text-yellow-200';
    if (uv <= 7) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-200';
    if (uv <= 10) return 'text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-200';
    return 'text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-200';
  };

  const getAQIColor = (aqi: number) => {
    switch(aqi) {
      case 1: return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-200';
      case 2: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40 dark:text-yellow-200';
      case 3: return 'text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-200';
      case 4: return 'text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-200';
      case 5: return 'text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getAQILabel = (aqi: number) => {
    switch(aqi) {
       case 1: return 'Good';
       case 2: return 'Fair';
       case 3: return 'Moderate';
       case 4: return 'Poor';
       case 5: return 'Very Poor';
       default: return 'Unknown';
   }
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
          const aqiStyle = day.aqi !== undefined ? getAQIColor(day.aqi) : '';

          return (
            <div key={day.dt} className="flex flex-col sm:flex-row items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-all duration-300 cursor-default group hover:scale-[1.01] hover:shadow-md">
              
              {/* Day & Icon */}
              <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start mb-2 sm:mb-0">
                <span className="w-16 sm:w-24 font-medium text-gray-700 dark:text-gray-200 truncate text-left">{dayName}</span>
                <div className="flex items-center sm:pl-4">
                   <img src={iconUrl} alt="icon" className="w-10 h-10 -my-2" />
                   <span className="text-sm text-gray-600 dark:text-gray-400 capitalize hidden sm:block ml-2 w-24 truncate">
                      {day.weather[0].main}
                   </span>
                </div>
              </div>

              {/* Metrics (UV, AQI, Temps) */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-2 sm:gap-4">
                
                {/* Environmental Badges (Hidden on very small screens if crowded, or flex wrap) */}
                <div className="flex gap-2">
                  {/* UV Index Indicator */}
                  {day.uvIndex !== undefined && (
                     <div 
                        className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${uvStyle} transition-transform hover:scale-110 cursor-help`} 
                        title={`UV Index: ${day.uvIndex.toFixed(1)}`}
                     >
                       <Sun size={12} className="mr-1" />
                       <span>{day.uvIndex.toFixed(0)}</span>
                     </div>
                  )}

                  {/* AQI Indicator */}
                  {day.aqi !== undefined && (
                     <div 
                        className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${aqiStyle} transition-transform hover:scale-110 cursor-help`} 
                        title={`Air Quality: ${getAQILabel(day.aqi)} (${day.aqi})`}
                     >
                       <Activity size={12} className="mr-1" />
                       <span className="hidden xs:inline">AQI</span>
                       <span className="ml-1">{day.aqi}</span>
                     </div>
                  )}
                </div>
                
                {/* Temperatures */}
                <div className="flex items-center space-x-3 text-sm sm:text-base ml-auto sm:ml-0">
                    <span className="font-bold text-gray-900 dark:text-white w-8 text-right">{Math.round(day.main.temp_max)}°</span>
                    <span className="text-gray-500 dark:text-gray-400 w-8 text-right">{Math.round(day.main.temp_min)}°</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};