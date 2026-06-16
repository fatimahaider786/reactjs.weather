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

  // Browser ki Local Storage se history load karein (Bina backend ke history dikhane ke liye!)
  const loadLocalHistory = () => {
    const savedHistory = localStorage.getItem("weather_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  };

  useEffect(() => {
    loadLocalHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setWeatherData(null);
    setLocationData(null);
    
    try {
      
      const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=719df68903e144a29a0120015241606&q=${city}`);
      
      if (response.data && response.data.current) {
        setWeatherData(response.data.current);
        setLocationData(response.data.location);
        
        // Browser ke LocalStorage mein recent search automatic save karein
        const newLog = {
          city: response.data.location.name,
          country: response.data.location.country,
          temp: `${response.data.current.temp_c}°C`
        };
        
        let currentHistory = localStorage.getItem("weather_history") ? JSON.parse(localStorage.getItem("weather_history")) : [];
        
        
        currentHistory = currentHistory.filter(item => item.city.toLowerCase() !== newLog.city.toLowerCase());
        
        currentHistory.unshift(newLog);
        if (currentHistory.length > 5) currentHistory.pop(); // Sirf top 5 searches dikhane ke liye
        
        localStorage.setItem("weather_history", JSON.stringify(currentHistory));
        setHistory(currentHistory);
      } else {
        throw new Error("Invalid Data");
      }
    } catch (err) {
      setError("City not found! Please check the spelling globally (e.g. London, Tokyo, Paris).");
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
            <input type="text" placeholder="City (e.g. London, New York)..." value={city} onChange={(e) => setCity(e.target.value)} required />
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
              <span className="status-tag">☀️ Live Data</span>
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
          <h3>📜 Recent Searches (Saved via LocalStorage)</h3>
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