import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "https://beckend-weather.vercel.app/";

function App() {
  const [city, setCity] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [history, setHistory] = useState([]); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟢 GLOBLAL HISTORY FETCH: Yeh function backend/MongoDB se history lekar aayega
  const fetchGlobalHistory = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/history`);
      setHistory(response.data);
    } catch (err) {
      console.error("Global history fetch karne mein error:", err);
    }
  };

  // Page load hote hi sabse pehle database se history load hogi
  useEffect(() => {
    fetchGlobalHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setWeatherData(null);
    setLocationData(null);
    
    try {
      
      const response = await axios.get(`${BACKEND_URL}/api/weather?city=${city}`);
      
      if (response.data && response.data.current) {
        setWeatherData(response.data.current);
        setLocationData(response.data.location);
        
        // 🟢 FIX: Search hone ke baad database se fresh history dubara pull karein
        fetchGlobalHistory();
      } else {
        throw new Error("Invalid Data Structure");
      }
    } catch (err) {
      setError("City nahi mili ya backend server offline hai!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="weather-card">
        <h1 className="title">Weather App</h1>
        
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
          <h3>📜 Recent Searches (Global MongoDB History)</h3>
          {history.length === 0 ? (
            <p style={{ color: '#aaa', marginTop: '10px', textAlign: 'center' }}>No recent searches yet.</p>
          ) : (
            <ul className="history-list">
              {history.map((item, index) => (
                <li key={index} className="history-item">
                  {/* MongoDB ka structure backend par 'city' aur 'country' property save karta hai */}
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