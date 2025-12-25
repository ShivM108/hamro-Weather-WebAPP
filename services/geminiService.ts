import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

// This service is optional and fails gracefully if no API key is present.
// It enhances the app with "Smart" recommendations.

export const getAIWeatherInsight = async (weather: WeatherData): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Add your Gemini API Key to enable smart weather insights!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are a friendly, witty weather assistant for the app "Hamro Weather".
      Current weather in ${weather.name}:
      - Condition: ${weather.weather[0].description}
      - Temp: ${Math.round(weather.main.temp)}°
      - Feels Like: ${Math.round(weather.main.feels_like)}°
      - Humidity: ${weather.main.humidity}%
      - Wind: ${weather.wind.speed} speed
      ${weather.uvIndex !== undefined ? `- UV Index: ${weather.uvIndex}` : ''}
      ${weather.aqi !== undefined ? `- Air Quality Index: ${weather.aqi} (Scale: 1 Good to 5 Very Poor)` : ''}

      Provide a SHORT (max 2 sentences) output:
      1. A practical clothing recommendation.
      2. A fun or useful activity suggestion.
      ${weather.aqi && weather.aqi > 3 ? 'Include a brief warning about the poor air quality.' : ''}
      Do not use markdown formatting like bolding. Keep it conversational.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI insights currently unavailable. Enjoy the day!";
  }
};