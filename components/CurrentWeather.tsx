import React from 'react';
import { WeatherData } from '../types';
import { Wind, Droplets, Eye, ArrowDown, ArrowUp, Sun } from 'lucide-react';
import { WEEK_DAYS } from '../constants';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  const date = new Date(data.dt * 1000);
  const day = WEEK_DAYS[date.getDay()];
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Map icon code to high res image or default OWM
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  const getUVDetails = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-green-500', advice: 'No protection needed.' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-yellow-400', advice: 'Sunscreen recommended.' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-500', advice: 'Cover up & sunscreen.' };
    if (uv <= 10) return { text: 'Very High', color: 'text-red-500', advice: 'Avoid midday sun.' };
    return { text: 'Extreme', color: 'text-purple-500', advice: 'Stay indoors!' };
  };

  const uvDetails = data.uvIndex !== undefined ? getUVDetails(data.uvIndex) : null;
  const uvPercentage = data.uvIndex !== undefined ? Math.min((data.uvIndex / 11) * 100, 100) : 0;

  return (
    <div className="relative overflow-hidden bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-gray-800 dark:text-white transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{data.name}</h2>
          <p className="text-lg opacity-80 mt-1">{day}, {time}</p>
          <span className="inline-block px-3 py-1 mt-2 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-200 text-sm font-medium capitalize">
            {data.weather[0].description}
          </span>
        </div>
        <img src={iconUrl} alt={data.weather[0].description} className="w-24 h-24 -mr-4 -mt-4 drop-shadow-lg" />
      </div>

      {/* Main Temp */}
      <div className="flex items-center mb-8">
        <div className="text-7xl sm:text-8xl font-bold tracking-tighter">
          {Math.round(data.main.temp)}°
        </div>
        <div className="ml-6 space-y-1">
          <div className="flex items-center text-sm opacity-80">
            <ArrowUp size={16} className="mr-1 text-red-400" />
            <span>High: {Math.round(data.main.temp_max)}°</span>
          </div>
          <div className="flex items-center text-sm opacity-80">
            <ArrowDown size={16} className="mr-1 text-blue-400" />
            <span>Low: {Math.round(data.main.temp_min)}°</span>
          </div>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/40 dark:bg-black/20 p-3 rounded-xl flex flex-col items-center justify-center text-center backdrop-blur-sm">
          <Droplets className="w-6 h-6 mb-1 text-blue-500" />
          <span className="text-sm opacity-70">Humidity</span>
          <span className="font-semibold">{data.main.humidity}%</span>
        </div>
        <div className="bg-white/40 dark:bg-black/20 p-3 rounded-xl flex flex-col items-center justify-center text-center backdrop-blur-sm">
          <Wind className="w-6 h-6 mb-1 text-teal-500" />
          <span className="text-sm opacity-70">Wind</span>
          <span className="font-semibold">{Math.round(data.wind.speed)} {unit === 'metric' ? 'm/s' : 'mph'}</span>
        </div>
        <div className="bg-white/40 dark:bg-black/20 p-3 rounded-xl flex flex-col items-center justify-center text-center backdrop-blur-sm">
          <span className="text-xl font-bold mb-0.5">Feels</span>
          <span className="text-sm opacity-70">Like</span>
          <span className="font-semibold">{Math.round(data.main.feels_like)}°</span>
        </div>
         <div className="bg-white/40 dark:bg-black/20 p-3 rounded-xl flex flex-col items-center justify-center text-center backdrop-blur-sm">
          <Eye className="w-6 h-6 mb-1 text-yellow-500" />
          <span className="text-sm opacity-70">Visibility</span>
          <span className="font-semibold">{(data.visibility / 1000).toFixed(1)} km</span>
        </div>
      </div>

      {/* UV Index Section */}
      {data.uvIndex !== undefined && uvDetails && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-end justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-orange-400" />
              <span className="font-semibold text-sm uppercase tracking-wide opacity-80">UV Index</span>
            </div>
            <div className="text-right">
              <span className={`text-xl font-bold ${uvDetails.color} mr-2`}>
                {data.uvIndex.toFixed(1)}
              </span>
              <span className="text-sm font-medium opacity-90">{uvDetails.text}</span>
            </div>
          </div>
          
          {/* Gradient Bar */}
          <div className="relative w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700/50 overflow-hidden shadow-inner">
             <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-500 to-purple-600 opacity-90" />
             <div className="absolute inset-0 bg-white/20" /> {/* Gloss effect */}
          </div>
          
          {/* Slider Marker (Positioned relative to bar width) */}
          <div className="relative w-full h-0">
             <div 
               className="absolute -top-4 w-4 h-4 bg-white border-2 border-gray-300 dark:border-gray-600 rounded-full shadow-lg transform -translate-x-1/2 transition-all duration-700 ease-out"
               style={{ left: `${uvPercentage}%` }}
             >
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-white/50"></div>
             </div>
          </div>

          <p className="text-xs mt-3 text-right opacity-75 italic">
            "{uvDetails.advice}"
          </p>
        </div>
      )}
    </div>
  );
};