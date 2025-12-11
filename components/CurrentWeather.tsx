import React from 'react';
import { WeatherData } from '../types';
import { Wind, Droplets, Eye, ArrowDown, ArrowUp, Sun, Activity } from 'lucide-react';
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

  const getUVStatus = (uv: number) => {
    // Using standard EPA breakpoints: 0-2 Low, 3-5 Mod, 6-7 High, 8-10 Very High, 11+ Extreme
    if (uv < 3) return { text: 'Low', color: 'text-green-500', advice: 'No protection needed' };
    if (uv < 6) return { text: 'Moderate', color: 'text-yellow-500', advice: 'Wear sunscreen' };
    if (uv < 8) return { text: 'High', color: 'text-orange-500', advice: 'Cover up & sunscreen' };
    if (uv < 11) return { text: 'Very High', color: 'text-red-500', advice: 'Avoid midday sun' };
    return { text: 'Extreme', color: 'text-purple-500', advice: 'Stay indoors' };
  };

  const getAQIStatus = (aqi: number) => {
    switch(aqi) {
      case 1: return { text: 'Good', color: 'text-green-500', barColor: 'bg-green-500', advice: 'Air quality is satisfactory' };
      case 2: return { text: 'Fair', color: 'text-yellow-500', barColor: 'bg-yellow-500', advice: 'Sensitive groups: reduce exertion' };
      case 3: return { text: 'Moderate', color: 'text-orange-500', barColor: 'bg-orange-500', advice: 'Unhealthy for sensitive groups' };
      case 4: return { text: 'Poor', color: 'text-red-500', barColor: 'bg-red-500', advice: 'Unhealthy for everyone' };
      case 5: return { text: 'Very Poor', color: 'text-purple-500', barColor: 'bg-purple-500', advice: 'Emergency health warning' };
      default: return { text: 'Unknown', color: 'text-gray-500', barColor: 'bg-gray-500', advice: 'No data available' };
    }
  };

  const uvStatus = data.uvIndex !== undefined ? getUVStatus(data.uvIndex) : null;
  const aqiStatus = data.aqi !== undefined ? getAQIStatus(data.aqi) : null;

  // Segment configuration for UV bar
  // Each block represents a range. We assume max visual scale is around 13 to give 'Extreme' some space.
  const uvSegments = [
      { min: 0, max: 3, color: 'bg-green-500' },     // Low (0-2.99)
      { min: 3, max: 6, color: 'bg-yellow-400' },    // Moderate (3-5.99)
      { min: 6, max: 8, color: 'bg-orange-500' },    // High (6-7.99)
      { min: 8, max: 11, color: 'bg-red-500' },      // Very High (8-10.99)
      { min: 11, max: 13, color: 'bg-purple-500' }   // Extreme (11+)
  ];
  const maxUVScale = 13; 

  return (
    <div className="relative overflow-hidden bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-gray-800 dark:text-white">
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

      {/* Environmental Details (UV & AQI) */}
      {(uvStatus || aqiStatus) && (
        <div className={`mt-4 pt-4 border-t border-white/10 grid grid-cols-1 ${uvStatus && aqiStatus ? 'sm:grid-cols-2' : ''} gap-4`}>
          
          {/* UV Index - Segmented Progress Bar */}
          {data.uvIndex !== undefined && uvStatus && (
            <div className="bg-white/40 dark:bg-black/20 p-4 rounded-xl backdrop-blur-sm flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Sun className="w-5 h-5 text-orange-400" />
                  <span className="font-semibold text-sm uppercase tracking-wide opacity-80">UV Index</span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${uvStatus.color} mr-2`}>{data.uvIndex.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex w-full h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-2">
                {uvSegments.map((seg, i) => {
                  const range = seg.max - seg.min;
                  // Calculate how much of this specific segment is filled
                  const filled = Math.max(0, Math.min(data.uvIndex! - seg.min, range));
                  const widthPercent = (filled / range) * 100;
                  // Basis is proportional to range size vs total scale for layout width
                  const flexBasis = (range / maxUVScale) * 100;
                  
                  return (
                    <div 
                        key={i} 
                        style={{ flexBasis: `${flexBasis}%` }}
                        className="h-full border-r border-white/40 dark:border-slate-800 last:border-0 bg-gray-300 dark:bg-gray-600 relative"
                    >
                        <div 
                            className={`h-full ${seg.color} transition-all duration-700 ease-out`}
                            style={{ width: `${widthPercent}%` }}
                        />
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between items-end mt-1">
                 <span className={`text-sm font-bold ${uvStatus.color}`}>{uvStatus.text}</span>
                 <p className="text-xs opacity-70">{uvStatus.advice}</p>
              </div>
            </div>
          )}

          {/* AQI */}
          {data.aqi !== undefined && aqiStatus && (
            <div className="bg-white/40 dark:bg-black/20 p-4 rounded-xl backdrop-blur-sm flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold text-sm uppercase tracking-wide opacity-80">Air Quality</span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${aqiStatus.color} mr-2`}>Level {data.aqi}</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden mb-2">
                 <div 
                   className={`h-full rounded-full transition-all duration-500 ease-out ${aqiStatus.barColor}`} 
                   style={{ width: `${(data.aqi / 5) * 100}%` }}
                   aria-label={`AQI Level: ${aqiStatus.text}`}
                 ></div>
              </div>
              
              <div className="flex justify-between items-end mt-1">
                 <span className={`text-sm font-bold ${aqiStatus.color}`}>{aqiStatus.text}</span>
                 <p className="text-xs opacity-70 text-right max-w-[60%] leading-tight">{aqiStatus.advice}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};