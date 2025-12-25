export interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface Pollutants {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

export interface WeatherAlert {
  id: string;
  event: string;
  sender_name: string;
  description: string;
  severity: 'critical' | 'warning' | 'advisory';
  start?: number;
  end?: number;
}

export interface WeatherData {
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  visibility: number;
  dt: number;
  uvIndex?: number;
  aqi?: number;
  pollutants?: Pollutants;
  alerts?: WeatherAlert[];
}

export interface ForecastData {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  dt_txt: string;
  uvIndex?: number;
  aqi?: number;
  pollutants?: Pollutants;
}

export interface ForecastResponse {
  list: ForecastData[];
  city: {
    name: string;
    country: string;
  };
}