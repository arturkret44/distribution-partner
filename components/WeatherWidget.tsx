"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  temperature: number;
  windspeed: number;
  precipitation: number;
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=59.33&longitude=18.06&current=temperature_2m,precipitation,windspeed_10m"
        );
        const data = await res.json();

        setWeather({
          temperature: data.current.temperature_2m,
          windspeed: data.current.windspeed_10m,
          precipitation: data.current.precipitation,
        });
      } catch (err) {
        console.error("Weather error:", err);
      }
    }

    fetchWeather();
  }, []);

  return (
    <div
      className="rounded-2xl p-5 bg-white/60 backdrop-blur-xl border border-gray-200
      border-l-4 border-blue-400 shadow-sm hover:shadow-md transition"
    >
      <p className="text-xs text-gray-400">Weather (Sweden)</p>

      {weather ? (
        <div className="mt-2">
          <p className="text-2xl font-semibold">
            {weather.temperature}°C
          </p>

          <div className="text-sm text-gray-500 mt-1 space-y-1">
            <p>💨 Wind: {weather.windspeed} km/h</p>
            <p>🌧 Rain: {weather.precipitation} mm</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400 mt-2">Loading...</p>
      )}
    </div>
  );
}
