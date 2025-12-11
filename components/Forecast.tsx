import React from 'react';
import { ForecastData } from '../types';
import { WEEK_DAYS } from '../constants';

interface ForecastProps {
  forecast: ForecastData[];
  unit: 'metric' | 'imperial';
}

export const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
  return (
    <div className="bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">5-Day Forecast</h3>
      <div className="space-y-4">
        {forecast.map((day) => {
          const date = new Date(day.dt * 1000);
          const dayName = WEEK_DAYS[date.getDay()];
          const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

          return (
            <div key={day.dt} className="flex items-center justify-between p-3 hover:bg-white/40 dark:hover:bg-white/10 rounded-xl transition-colors cursor-default group">
              <span className="w-24 font-medium text-gray-700 dark:text-gray-200">{dayName}</span>
              
              <div className="flex items-center flex-1 justify-center">
                 <img src={iconUrl} alt="icon" className="w-10 h-10" />
                 <span className="text-sm text-gray-600 dark:text-gray-400 capitalize hidden sm:block ml-2">
                    {day.weather[0].main}
                 </span>
              </div>

              <div className="flex items-center space-x-4 w-32 justify-end">
                <span className="font-bold text-gray-900 dark:text-white">{Math.round(day.main.temp_max)}°</span>
                <span className="text-gray-500 dark:text-gray-400">{Math.round(day.main.temp_min)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};