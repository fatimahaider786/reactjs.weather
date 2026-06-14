import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [history, setHistory] = useState([]); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/history");
      setHistory(res.data);
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const searchQuery = countryInput ? `${city},${countryInput}` : city;
      const response = await axios.get(`http://localhost:5000/api/weather?city=${searchQuery}`);
      
      setWeatherData(response.data.current);
      setLocationData(response.data.location);
      
      fetchHistory(); 
    } catch (err) {
      setError("City not found! Please check spelling.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="weather-card">
        <h1 className="title"> Weather App</h1>
        
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" placeholder="City..." value={city} onChange={(e) => setCity(e.target.value)} required />
            <input type="text" placeholder="Country (Optional)..." value={countryInput} onChange={(e) => setCountryInput(e.target.value)} />
          </div>
          <button type="submit" className="search-btn">{loading ? "Searching..." : "Get Weather"}</button>
        </form>

        {error && <div className="error-msg">{error}</div>}

        {weatherData && locationData && (
          <div className="weather-dashboard">
            <div className="main-info">
              <h2>{locationData.name}, <span className="country-name">{locationData.country}</span></h2>
              <div className="temp-display">
                <span className="celsius">{weatherData.temp_c}°C</span>
                <span className="fahrenheit"> / {weatherData.temp_f}°F</span>
              </div>
              <span className="status-tag">☀️ Day Time</span>
            </div>

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
                <strong>{weatherData.wind_kph} Kph</strong>
              </div>
              <div className="grid-item">
                <span>Wind Direction</span>
                <strong>{weatherData.wind_dir}</strong>
              </div>
            </div>
          </div>
        )}


        <hr className="divider" />


        <div className="history-section">
          <h3>📜 Recent Searches (Saved in MongoDB)</h3>
          {history.length === 0 ? (
            <p style={{ color: '#aaa', marginTop: '10px', textAlign: 'center' }}>No recent searches yet.</p>
          ) : (
            <ul className="history-list">
              {history.map((item, index) => (
                <li key={index} className="history-item">
                  <span>{item.city}, {item.country}</span>
                  <strong className="history-temp">{item.temp}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;