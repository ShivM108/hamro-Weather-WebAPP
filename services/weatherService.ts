import { OWM_API_KEY, OWM_BASE_URL } from '../constants';
import { WeatherData, ForecastData, ForecastResponse, Pollutants, WeatherAlert } from '../types';

const getParams = (params: Record<string, string>) => {
  return new URLSearchParams({
    appid: OWM_API_KEY,
    ...params,
  }).toString();
};

const detectAlerts = (data: WeatherData): WeatherAlert[] => {
  const alerts: WeatherAlert[] = [];
  const weatherId = data.weather[0].id;
  
  // 1. Severe Weather Codes (OWM 2xx, 5xx, 6xx, 7xx)
  if (weatherId >= 200 && weatherId <= 232) {
    alerts.push({
      id: 'storm',
      event: 'Thunderstorm Warning',
      sender_name: 'Hamro Meteorological Center',
      description: 'Severe thunderstorm conditions detected. Stay indoors and avoid using electrical equipment.',
      severity: 'warning'
    });
  } else if (weatherId === 781) {
    alerts.push({
      id: 'tornado',
      event: 'Tornado Warning',
      sender_name: 'Emergency Alert System',
      description: 'Extremely dangerous tornado conditions detected in this area. Seek shelter immediately in a basement or interior room.',
      severity: 'critical'
    });
  } else if (weatherId === 771) {
    alerts.push({
      id: 'squall',
      event: 'Wind Squall Advisory',
      sender_name: 'Local Weather Station',
      description: 'Sudden high-velocity winds expected. Secure loose outdoor items.',
      severity: 'advisory'
    });
  }

  // 2. Heavy Precipitation
  if (weatherId === 502 || weatherId === 503 || weatherId === 504) {
    alerts.push({
      id: 'heavy-rain',
      event: 'Heavy Rain Warning',
      sender_name: 'Hydrological Services',
      description: 'Intense rainfall may lead to localized flooding and reduced visibility.',
      severity: 'warning'
    });
  }

  // 3. Environmental Hazards (UV/AQI)
  if (data.uvIndex && data.uvIndex >= 11) {
    alerts.push({
      id: 'extreme-uv',
      event: 'Extreme UV Alert',
      sender_name: 'Health Advisory',
      description: 'UV index is at extreme levels. Unprotected skin can burn in minutes. Stay in shade or indoors between 10 AM and 4 PM.',
      severity: 'warning'
    });
  }

  if (data.aqi && data.aqi >= 5) {
    alerts.push({
      id: 'hazardous-aqi',
      event: 'Hazardous Air Quality',
      sender_name: 'Environment Protection Agency',
      description: 'Air pollution is at dangerous levels. Everyone should avoid all outdoor physical activities.',
      severity: 'critical'
    });
  }

  return alerts;
};

export const getWeatherData = async (city: string, unit: 'metric' | 'imperial'): Promise<WeatherData> => {
  const response = await fetch(`${OWM_BASE_URL}/weather?${getParams({ q: city, units: unit })}`);
  if (!response.ok) {
    throw new Error(`City not found: ${city}`);
  }
  const data = await response.json();
  
  try {
    const [uv, pollution] = await Promise.all([
      getUVIndex(data.coord.lat, data.coord.lon),
      getAirQuality(data.coord.lat, data.coord.lon)
    ]);

    if (uv !== null) data.uvIndex = uv;
    if (pollution !== null) {
      data.aqi = pollution.aqi;
      data.pollutants = pollution.components;
    }
    
    // Attach detected alerts
    data.alerts = detectAlerts(data);
  } catch (e) {
    console.warn("Could not fetch additional weather metrics", e);
  }

  return data;
};

export const getCityByCoords = async (lat: number, lon: number, unit: 'metric' | 'imperial'): Promise<WeatherData> => {
  const response = await fetch(`${OWM_BASE_URL}/weather?${getParams({ lat: lat.toString(), lon: lon.toString(), units: unit })}`);
  if (!response.ok) {
    throw new Error('Could not fetch weather for coordinates');
  }
  const data = await response.json();

  try {
    const [uv, pollution] = await Promise.all([
      getUVIndex(data.coord.lat, data.coord.lon),
      getAirQuality(data.coord.lat, data.coord.lon)
    ]);

    if (uv !== null) data.uvIndex = uv;
    if (pollution !== null) {
      data.aqi = pollution.aqi;
      data.pollutants = pollution.components;
    }

    // Attach detected alerts
    data.alerts = detectAlerts(data);
  } catch (e) {
    console.warn("Could not fetch additional weather metrics", e);
  }

  return data;
};

export const getUVIndex = async (lat: number, lon: number): Promise<number | null> => {
  try {
    const response = await fetch(`${OWM_BASE_URL}/uvi?${getParams({ lat: lat.toString(), lon: lon.toString() })}`);
    if (response.ok) {
      const data = await response.json();
      return data.value;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getAirQuality = async (lat: number, lon: number): Promise<{ aqi: number, components: Pollutants } | null> => {
  try {
    const response = await fetch(`${OWM_BASE_URL}/air_pollution?${getParams({ lat: lat.toString(), lon: lon.toString() })}`);
    if (response.ok) {
      const data = await response.json();
      return data.list?.[0] ? { aqi: data.list[0].main.aqi, components: data.list[0].components } : null;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const getUVForecast = async (lat: number, lon: number): Promise<any[]> => {
  try {
    const response = await fetch(`${OWM_BASE_URL}/uvi/forecast?${getParams({ lat: lat.toString(), lon: lon.toString(), cnt: '5' })}`);
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    return [];
  }
};

const getAQIForecast = async (lat: number, lon: number): Promise<any[]> => {
  try {
    const response = await fetch(`${OWM_BASE_URL}/air_pollution/forecast?${getParams({ lat: lat.toString(), lon: lon.toString() })}`);
    if (response.ok) {
      const data = await response.json();
      return data.list || [];
    }
    return [];
  } catch (error) {
    return [];
  }
};

export const getForecastData = async (lat: number, lon: number, unit: 'metric' | 'imperial'): Promise<ForecastData[]> => {
  const response = await fetch(`${OWM_BASE_URL}/forecast?${getParams({ lat: lat.toString(), lon: lon.toString(), units: unit })}`);
  if (!response.ok) {
    throw new Error('Failed to fetch forecast');
  }
  const data: ForecastResponse = await response.json();
  
  const dailyForecast: ForecastData[] = [];
  const addedDates = new Set();

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    const hours = new Date(item.dt * 1000).getHours();
    
    if (!addedDates.has(date)) {
      if (hours >= 11 && hours <= 14) {
        dailyForecast.push(item);
        addedDates.add(date);
      } else if (!dailyForecast.find(f => new Date(f.dt * 1000).toDateString() === date)) {
           dailyForecast.push(item);
           addedDates.add(date);
      }
    } else {
        const existingIndex = dailyForecast.findIndex(f => new Date(f.dt * 1000).toDateString() === date);
        if (existingIndex !== -1) {
            const existingHours = new Date(dailyForecast[existingIndex].dt * 1000).getHours();
            if (Math.abs(hours - 12) < Math.abs(existingHours - 12)) {
                dailyForecast[existingIndex] = item;
            }
        }
    }
  });
  
  try {
    const [uvData, aqiData] = await Promise.all([
      getUVForecast(lat, lon),
      getAQIForecast(lat, lon)
    ]);

    dailyForecast.forEach(day => {
      const dayDate = new Date(day.dt * 1000).toDateString();
      
      if (Array.isArray(uvData) && uvData.length > 0) {
        const uvItem = uvData.find(u => new Date(u.date * 1000).toDateString() === dayDate);
        if (uvItem) day.uvIndex = uvItem.value;
      }

      if (Array.isArray(aqiData) && aqiData.length > 0) {
        const aqiItem = aqiData.find(a => new Date(a.dt * 1000).toDateString() === dayDate && new Date(a.dt * 1000).getHours() >= 12) 
                     || aqiData.find(a => new Date(a.dt * 1000).toDateString() === dayDate);
        
        if (aqiItem) {
          day.aqi = aqiItem.main.aqi;
          day.pollutants = aqiItem.components;
        }
      }
    });
  } catch (e) {
    console.warn("Could not merge additional forecast metrics", e);
  }

  return dailyForecast.slice(0, 5);
};