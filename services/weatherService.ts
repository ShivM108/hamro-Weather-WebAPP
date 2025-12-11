import { OWM_API_KEY, OWM_BASE_URL } from '../constants';
import { WeatherData, ForecastData, ForecastResponse } from '../types';

const getParams = (params: Record<string, string>) => {
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
  
  // Try to fetch UV Index and AQI
  try {
    const [uv, aqi] = await Promise.all([
      getUVIndex(data.coord.lat, data.coord.lon),
      getAirQuality(data.coord.lat, data.coord.lon)
    ]);

    if (uv !== null) data.uvIndex = uv;
    if (aqi !== null) data.aqi = aqi;
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

  // Try to fetch UV Index and AQI
  try {
    const [uv, aqi] = await Promise.all([
      getUVIndex(data.coord.lat, data.coord.lon),
      getAirQuality(data.coord.lat, data.coord.lon)
    ]);

    if (uv !== null) data.uvIndex = uv;
    if (aqi !== null) data.aqi = aqi;
  } catch (e) {
    console.warn("Could not fetch additional weather metrics", e);
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
    return null;
  } catch (error) {
    console.warn("Error fetching UV index:", error);
    return null;
  }
};

// Fetch Air Quality Index
export const getAirQuality = async (lat: number, lon: number): Promise<number | null> => {
  try {
    const response = await fetch(`${OWM_BASE_URL}/air_pollution?${getParams({ lat: lat.toString(), lon: lon.toString() })}`);
    if (response.ok) {
      const data = await response.json();
      // AQI is inside list[0].main.aqi
      return data.list?.[0]?.main?.aqi || null;
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
    console.warn("Failed to fetch UV forecast", error);
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
    console.warn("Failed to fetch AQI forecast", error);
    return [];
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
  
  // Fetch UV and AQI Forecasts and merge
  try {
    const [uvData, aqiData] = await Promise.all([
      getUVForecast(lat, lon),
      getAQIForecast(lat, lon)
    ]);

    dailyForecast.forEach(day => {
      const dayDate = new Date(day.dt * 1000).toDateString();
      
      // Match UV data
      if (Array.isArray(uvData) && uvData.length > 0) {
        const uvItem = uvData.find(u => new Date(u.date * 1000).toDateString() === dayDate);
        if (uvItem) {
          day.uvIndex = uvItem.value;
        }
      }

      // Match AQI data (AQI forecast is hourly, we pick one for the day)
      if (Array.isArray(aqiData) && aqiData.length > 0) {
        // Find closest to noon, or just the first match for the day
        const aqiItem = aqiData.find(a => new Date(a.dt * 1000).toDateString() === dayDate && new Date(a.dt * 1000).getHours() >= 12) 
                     || aqiData.find(a => new Date(a.dt * 1000).toDateString() === dayDate);
        
        if (aqiItem) {
          day.aqi = aqiItem.main.aqi;
        }
      }
    });
  } catch (e) {
    console.warn("Could not merge additional forecast metrics", e);
  }

  return dailyForecast.slice(0, 5); // Ensure max 5 days
};