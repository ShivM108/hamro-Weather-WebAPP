import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { AIInsight } from './components/AIInsight';
import { SearchHistory } from './components/SearchHistory';
import { NepalSelector } from './components/NepalSelector';
import { WeatherData, ForecastData } from './types';
import { getWeatherData, getForecastData, getCityByCoords } from './services/weatherService';
import { getAIWeatherInsight } from './services/geminiService';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check system preference or local storage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Theme effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const addToHistory = (city: string) => {
    setHistory(prev => {
      const newHistory = [city, ...prev.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const fetchAIInsight = async (weatherData: WeatherData) => {
    setAiLoading(true);
    try {
      const insight = await getAIWeatherInsight(weatherData);
      setAiInsight(insight);
    } catch (err) {
      console.error("Failed to fetch AI insight", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    setAiInsight(null);
    
    try {
      const weatherData = await getWeatherData(query, unit);
      setWeather(weatherData);
      addToHistory(weatherData.name);

      const forecastData = await getForecastData(weatherData.coord.lat, weatherData.coord.lon, unit);
      setForecast(forecastData);

      // Trigger AI Insight in background
      fetchAIInsight(weatherData);

    } catch (err: any) {
      setError(err.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  }, [unit]);

  // Handle Geolocation
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const cityData = await getCityByCoords(latitude, longitude, unit);
            setWeather(cityData);
            addToHistory(cityData.name);

            const forecastData = await getForecastData(latitude, longitude, unit);
            setForecast(forecastData);
            
            fetchAIInsight(cityData);
          } catch (err: any) {
            setError("Could not get weather for your location.");
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError("Location permission denied or unavailable.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Unit toggle re-fetch logic
  useEffect(() => {
    if (weather) {
      handleSearch(weather.name);
    }
  }, [unit]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-black' 
        : 'bg-gradient-to-br from-blue-400 via-blue-200 to-white'
    }`}>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} unit={unit} setUnit={setUnit} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Left Column: Search & History */}
          <div className="md:col-span-1 space-y-6">
            <SearchBar onSearch={handleSearch} onLocationClick={handleLocationClick} isLoading={loading} />
            
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded shadow-sm flex items-center animate-fade-in">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p>{error}</p>
              </div>
            )}

            <NepalSelector onSelectCity={handleSearch} />

            <SearchHistory history={history} onSelect={handleSearch} onClear={() => {
              setHistory([]);
              localStorage.removeItem('searchHistory');
            }} />

            <div className="hidden md:block">
               <AIInsight insight={aiInsight} loading={aiLoading} />
            </div>
          </div>

          {/* Right Column: Weather Display */}
          <div className="md:col-span-2 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-white/80">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-lg animate-pulse">Fetching latest weather data...</p>
              </div>
            ) : weather ? (
              <div className="space-y-6 animate-slide-up">
                <CurrentWeather data={weather} unit={unit} />
                
                {/* Mobile AI Insight */}
                <div className="md:hidden">
                  <AIInsight insight={aiInsight} loading={aiLoading} />
                </div>

                <Forecast forecast={forecast} unit={unit} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-white/70 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Welcome to Hamro Weather</h2>
                <p>Search for a city or use the "Browse Nepal" feature to get started.</p>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-700 dark:text-white/50 text-sm pb-6 transition-colors duration-300">
          <p>© 2025 Hamro Weather. BaazarSathi All Right Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;