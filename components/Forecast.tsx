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

  const getAQIAdvice = (aqi: number) => {
    switch(aqi) {
      case 1: return 'Perfect for outdoor activities.';
      case 2: return 'Generally okay for most.';
      case 3: return 'Sensitive groups should limit time outside.';
      case 4: return 'Avoid prolonged outdoor exertion.';
      case 5: return 'Health warning: Stay indoors if possible.';
      default: return '';
    }
  };

  return (
    <div className="bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
        <span>5-Day Forecast</span>
      </h3>
      <div className="space-y-4">
        {forecast.map((day) => {
          const date = new Date(day.dt * 1000);
          const dayName = WEEK_DAYS[date.getDay()];
          const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
          
          const uvStyle = day.uvIndex !== undefined ? getUVColor(day.uvIndex) : '';
          const aqiStyle = day.aqi !== undefined ? getAQIColor(day.aqi) : '';
          const aqiPercentage = day.aqi ? Math.round((day.aqi / 5) * 100) : 0;

          return (
            <div key={day.dt} className="flex flex-col sm:flex-row items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/5 rounded-xl transition-all duration-300 cursor-default group hover:scale-[1.01] hover:shadow-sm border border-transparent hover:border-white/10">
              
              {/* Day & Icon */}
              <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start mb-2 sm:mb-0">
                <span className="w-16 sm:w-24 font-bold text-gray-700 dark:text-gray-200 text-left">{dayName}</span>
                <div className="flex items-center sm:pl-4">
                   <img src={iconUrl} alt="weather icon" className="w-10 h-10 -my-2 drop-shadow-sm transition-transform group-hover:scale-110" />
                   <span className="text-xs text-gray-500 dark:text-gray-400 capitalize hidden md:block ml-2 w-20 truncate">
                      {day.weather[0].description}
                   </span>
                </div>
              </div>

              {/* Metrics (UV, AQI, Temps) */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-2 sm:gap-6">
                
                <div className="flex items-center gap-2">
                  {/* UV Index Indicator */}
                  {day.uvIndex !== undefined && (
                     <div 
                        className={`flex flex-col items-center justify-center min-w-[50px] px-2 py-1 rounded-lg ${uvStyle} transition-all duration-300 hover:scale-105 cursor-help relative group/uv`} 
                     >
                       <div className="flex items-center text-[9px] font-black uppercase tracking-tighter">
                          <Sun size={9} className="mr-0.5" />
                          <span>UV {day.uvIndex.toFixed(0)}</span>
                       </div>
                       <div className="w-full h-1 bg-current/20 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-current progress-bar-fill" style={{ width: `${Math.min((day.uvIndex / 11) * 100, 100)}%` }} />
                       </div>
                       
                       {/* Floating Tooltip Detail */}
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/uv:block z-20">
                          <div className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow-xl whitespace-nowrap">
                             UV Index: {day.uvIndex.toFixed(1)}
                          </div>
                       </div>
                     </div>
                  )}

                  {/* AQI Indicator with Percentage and Enhanced Hover */}
                  {day.aqi !== undefined && (
                     <div 
                        className={`flex flex-col items-center justify-center min-w-[75px] px-2 py-1 rounded-lg ${aqiStyle} transition-all duration-300 hover:scale-105 cursor-help relative group/aqi`} 
                     >
                       <div className="flex items-center text-[9px] font-black uppercase tracking-tighter">
                         <Activity size={9} className="mr-1" />
                         <span>AQI {aqiPercentage}%</span>
                       </div>
                       <div className="w-full h-1 bg-current/20 rounded-full mt-1 overflow-hidden">
                         <div 
                           className="h-full bg-current progress-bar-fill" 
                           style={{ width: `${aqiPercentage}%` }}
                         />
                       </div>

                       {/* Detailed Hover Card */}
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/aqi:block z-30 animate-fade-in pointer-events-none">
                          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-white/10 min-w-[140px]">
                            <div className="flex items-center justify-between mb-1">
                               <span className="text-[10px] font-bold uppercase opacity-60">Air Quality</span>
                               <span className="text-[10px] font-bold px-1.5 rounded bg-white/10">{aqiPercentage}%</span>
                            </div>
                            <div className="text-xs font-bold text-blue-300 mb-1">{getAQILabel(day.aqi)}</div>
                            <p className="text-[10px] leading-tight opacity-80 italic">{getAQIAdvice(day.aqi)}</p>
                            <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-400" style={{ width: `${aqiPercentage}%` }} />
                            </div>
                          </div>
                          {/* Triangle Tip */}
                          <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1 border-r border-b border-white/10"></div>
                       </div>
                     </div>
                  )}
                </div>
                
                {/* Temperatures */}
                <div className="flex items-center space-x-3 text-sm sm:text-base font-medium">
                    <span className="text-gray-900 dark:text-white font-bold w-9 text-right">{Math.round(day.main.temp_max)}°</span>
                    <span className="text-gray-400 dark:text-gray-500 w-9 text-right">{Math.round(day.main.temp_min)}°</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};