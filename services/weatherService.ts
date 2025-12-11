import { OWM_API_KEY, OWM_BASE_URL } from '../constants';
import { WeatherData, ForecastData, ForecastResponse } from '../types';

const getParams = (params: Record<string, string>) => {
  if (!OWM_API_KEY) {
    throw new Error("API Key missing. Please configure OWM_API_KEY.");
  }
  return new URLSearchParams({
    appid: OWM_API_KEY,
    ...params,
  }).toString();
};

export const getWeatherData = async (city: string, unit: 'metric' | 'imperial'): Promise<WeatherData> => {
  const response = await fetch(`${OWM_BASE_URL}/weather?${getParams({ q: city, units: unit })}`);
  if (!response.ok) {
    throw new Error(`City not found: ${city}`);
  }
  const data = await response.json();
  
  // Try to fetch UV Index
  try {
    const uv = await getUVIndex(data.coord.lat, data.coord.lon);
    if (uv !== null) {
      data.uvIndex = uv;
    }
  } catch (e) {
    console.warn("Could not fetch UV index", e);
  }

  return data;
};

export const getCityByCoords = async (lat: number, lon: number, unit: 'metric' | 'imperial'): Promise<WeatherData> => {
  const response = await fetch(`${OWM_BASE_URL}/weather?${getParams({ lat: lat.toString(), lon: lon.toString(), units: unit })}`);
  if (!response.ok) {
    throw new Error('Could not fetch weather for coordinates');
  }
  const data = await response.json();

  // Try to fetch UV Index
  try {
    const uv = await getUVIndex(data.coord.lat, data.coord.lon);
    if (uv !== null) {
      data.uvIndex = uv;
    }
  } catch (e) {
    console.warn("Could not fetch UV index", e);
  }

  return data;
};

// Fetch UV Index using OWM APIs
export const getUVIndex = async (lat: number, lon: number): Promise<number | null> => {
  try {
    // Attempt to use the separate UV endpoint (legacy but often works with standard keys)
    const response = await fetch(`${OWM_BASE_URL}/uvi?${getParams({ lat: lat.toString(), lon: lon.toString() })}`);
    
    if (response.ok) {
      const data = await response.json();
      return data.value;
    }
    
    // If that fails (e.g., deprecated), we might try OneCall if the key supports it, 
    // but for this demo, we'll return null if the specific endpoint fails.
    return null;
  } catch (error) {
    return null;
  }
};

export const getForecastData = async (lat: number, lon: number, unit: 'metric' | 'imperial'): Promise<ForecastData[]> => {
  const response = await fetch(`${OWM_BASE_URL}/forecast?${getParams({ lat: lat.toString(), lon: lon.toString(), units: unit })}`);
  if (!response.ok) {
    throw new Error('Failed to fetch forecast');
  }
  const data: ForecastResponse = await response.json();
  
  // OWM 5-day forecast returns data every 3 hours (40 items).
  // We need to filter this to get one reading per day (e.g., closest to noon).
  const dailyForecast: ForecastData[] = [];
  const addedDates = new Set();

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    // Try to pick the reading closer to noon (12:00:00)
    const hours = new Date(item.dt * 1000).getHours();
    
    if (!addedDates.has(date)) {
      if (hours >= 11 && hours <= 14) {
        dailyForecast.push(item);
        addedDates.add(date);
      } else if (!dailyForecast.find(f => new Date(f.dt * 1000).toDateString() === date)) {
          // If we haven't added this day yet, and it's not noon, add it purely if it's the first one we see 
          // (fallback for end of list) - but usually better to wait for the noon slot if available
           dailyForecast.push(item);
           addedDates.add(date);
      }
    } else {
        // If we already added this day, check if the current item is closer to noon than the stored one
        const existingIndex = dailyForecast.findIndex(f => new Date(f.dt * 1000).toDateString() === date);
        if (existingIndex !== -1) {
            const existingHours = new Date(dailyForecast[existingIndex].dt * 1000).getHours();
            // If current is closer to 12 than existing
            if (Math.abs(hours - 12) < Math.abs(existingHours - 12)) {
                dailyForecast[existingIndex] = item;
            }
        }
    }
  });

  return dailyForecast.slice(0, 5); // Ensure max 5 days
};