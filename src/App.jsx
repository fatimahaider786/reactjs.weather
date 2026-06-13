import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const searchQuery = countryInput ? `${city},${countryInput}` : city;

      // ⚠️ Note: Agar aapne apna backend bana liya hai to URL ko change karke
      // `http://localhost:5000/api/weather?city=${searchQuery}` kar dein.
      const response = await axios.get(
        `https://p2pclouds.up.railway.app/v1/learn/weather?city=${searchQuery}`
      );
      
      if (response.data && response.data.current) {
        setWeatherData(response.data.current);
        setLocationData(response.data.location);
      } else {
        setError("Invalid data received from server.");
      }
    } catch (err) {
      console.error(err);
      setError("City or Country not found! Please check spelling.");
      setWeatherData(null);
      setLocationData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="weather-card">
        <h1 className="title"> Weather App</h1>
        
        {/* Search Form */}
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Enter City (e.g. Lahore)" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              required
            />
            <input 
              type="text" 
              placeholder="Enter Country (Optional)" 
              value={countryInput} 
              onChange={(e) => setCountryInput(e.target.value)} 
            />
          </div>
          <button type="submit" className="search-btn">
            {loading ? "Searching..." : "Get Weather"}
          </button>
        </form>

        {/* Loading & Errors */}
        {loading && <div className="loader">Fetching latest weather data...</div>}
        {error && <div className="error-msg">{error}</div>}

        {/* Weather Dashboard Output */}
        {weatherData && locationData && (
          <div className="weather-dashboard">
            
            <div className="main-info">
              <h2>{locationData.name}, <span className="country-name">{locationData.country}</span></h2>
              <div className="temp-display">
                <span className="celsius">{weatherData.temp_c}°C</span>
                <span className="fahrenheit">/ {weatherData.temp_f}°F</span>
              </div>
              <p className="status-tag">
                Time: {weatherData.is_day === 1 ? "☀️ Day Time" : "🌙 Night Time"}
              </p>
            </div>

            <hr className="divider" />

            <div className="weather-grid">
              <div className="grid-item">
                <span>Feels Like</span>
                <strong>{weatherData.feelslike_c}°C ({weatherData.feelslike_f}°F)</strong>
              </div>
              <div className="grid-item">
                <span>Humidity</span>
                <strong>{weatherData.humidity}%</strong>
              </div>
              <div className="grid-item">
                <span>Wind Speed</span>
                <strong>{weatherData.wind_kph} Kph ({weatherData.wind_mph} Mph)</strong>
              </div>
              <div className="grid-item">
                <span>Wind Direction</span>
                <strong>{weatherData.wind_dir} ({weatherData.wind_degree}°)</strong>
              </div>
              <div className="grid-item">
                <span>Visibility</span>
                <strong>{weatherData.vis_km} Km ({weatherData.vis_miles} Mi)</strong>
              </div>
              <div className="grid-item">
                <span>Pressure</span>
                <strong>{weatherData.pressure_mb} mb</strong>
              </div>
              <div className="grid-item">
                <span>Precipitation</span>
                <strong>{weatherData.precip_mm} mm</strong>
              </div>
              <div className="grid-item">
                <span>Wind Chill</span>
                <strong>{weatherData.windchill_c}°C</strong>
              </div>
            </div>

            <div className="footer-note">
              Last Updated: {weatherData.last_updated}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;