import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  // Check if running on localhost or live production
  const isLocal = window.location.hostname === "localhost";

  // Base URL configuration based on environment
  const BACKEND_BASE_URL = isLocal
    ? "http://localhost:5000"
    : "https://beckend-weather.vercel.app"; // 🟢 Aapka Live Vercel Backend Link

  // 1. Fetch Search History Function
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/api/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("History fetch error:", err.message);
    }
  };

  // Fetch history on page load
  useEffect(() => {
    fetchHistory();
  }, []);

  // 2. Handle Weather Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setWeatherData(null);

    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/api/weather?city=${city}`);
      setWeatherData(res.data);
      setCity(""); // Input clear karne ke liye
      fetchHistory(); // Nayi search ke baad history refresh karne ke liye
    } catch (err) {
      setError("City not found or server error. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <h1>Global Weather App</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Error Message */}
      {error && <p className="error-msg">{error}</p>}

      {/* Weather Result Display */}
      {weatherData && (
        <div className="weather-card">
          <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
          <div className="weather-info">
            <img src={weatherData.current.condition.icon} alt="weather icon" />
            <h3>{weatherData.current.temp_c}°C</h3>
          </div>
          <p>Condition: {weatherData.current.condition.text}</p>
          <p>Humidity: {weatherData.current.humidity}%</p>
          <p>Wind Speed: {weatherData.current.wind_kph} kph</p>
        </div>
      )}

      {/* Search History Section */}
      <div className="history-section">
        <h3>Recent Searches (Database Logs)</h3>
        {history.length === 0 ? (
          <p>No search history found.</p>
        ) : (
          <ul className="history-list">
            {history.map((item, index) => (
              <li key={item._id || index} className="history-item">
                <span className="history-city">{item.city}, {item.country}</span>
                <span className="history-temp">{item.temp}</span>
                <span className="history-time">
                  {new Date(item.searchedAt).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;