import "./App.css"
import { useState } from "react";
import axios from "axios";
function App() {
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")

  const [temp, setTemp] = useState(0)
  const [fahrenheit, setFahrenheit] = useState(0)
  const [heatIndexC, setHeatIndexC] = useState(0)
  const [heatIndexF, setHeatIndexF] = useState(0)
  const [lastUpdated, setLastUpdated] = useState("");
  const [lastUpdatedEpoch, setLastUpdatedEpoch] = useState("");

  const [visibilityKm, setVisibilityKm] = useState(0);
  const [visibilityMiles, setVisibilityMiles] = useState(0);

  const [windDegree, setWindDegree] = useState(0);
  const [windDir, setWindDir] = useState("");

  const [windKph, setWindKph] = useState(0);
  const [windMph, setWindMph] = useState(0);

  const [windChillC, setWindChillC] = useState(0);
  const [windChillF, setWindChillF] = useState(0);

  const [pressureIn, setPressureIn] = useState(0);
  const [pressureMb, setPressureMb] = useState(0);

  const [precipIn, setPrecipIn] = useState(0);
  const [precipMm, setPrecipMm] = useState(0);

  const [humidity, setHumidity] = useState(0);

  const [dewPointC, setDewPointC] = useState(0);
  const [dewPointF, setDewPointF] = useState(0);

  const [feelsLikeC, setFeelsLikeC] = useState(0);
  const [feelsLikeF, setFeelsLikeF] = useState(0);

  const [isDay, setIsDay] = useState(0);

  const [gustKph, setGustKph] = useState(0);
  const [gustMph, setGustMph] = useState(0);




  const handelChange = (e) => {
    setCity(e.target.value)
  };
  const handelChangeCountry = (e) => {
    setCountry(e.target.value)
  };
  const handelSubmit = async (e) => {
    e.preventDefault()
    try {
      const weather = await axios.get(
        ` https://p2pclouds.up.railway.app/v1/learn/weather?city=${city}`
      );
      setTemp(weather.data.current.temp_c)
      setFahrenheit(weather.data.current.temp_f)
      setHeatIndexC(weather.data.current.heatindex_c)
      setHeatIndexF(weather.data.current.heatindex_f)
      setLastUpdated(weather.data.current.last_updated);
      setLastUpdatedEpoch(weather.data.current.last_updated_epoch);

      setVisibilityKm(weather.data.current.vis_km);
      setVisibilityMiles(weather.data.current.vis_miles);

      setWindDegree(weather.data.current.wind_degree);
      setWindDir(weather.data.current.wind_dir);

      setWindKph(weather.data.current.wind_kph);
      setWindMph(weather.data.current.wind_mph);

      setWindChillC(weather.data.current.windchill_c);
      setWindChillF(weather.data.current.windchill_f);
      setPressureIn(weather.data.current.pressure_in);
      setPressureMb(weather.data.current.pressure_mb);

      setPrecipIn(weather.data.current.precip_in);
      setPrecipMm(weather.data.current.precip_mm);

      setHumidity(weather.data.current.humidity);

      setDewPointC(weather.data.current.dewpoint_c);
      setDewPointF(weather.data.current.dewpoint_f);

      setFeelsLikeC(weather.data.current.feelslike_c);
      setFeelsLikeF(weather.data.current.feelslike_f);

      setIsDay(weather.data.current.is_day);

      setGustKph(weather.data.current.gust_kph);
      setGustMph(weather.data.current.gust_mph);



    } catch (error) {
      console.error("error findind the weather data", error);
    }

  };
  return (
    <>
    <div className="container">

      <h1> Temprature :{temp}</h1>

      <p> Fahrenheit :{fahrenheit}</p>

      <p> heat Index (C) : {heatIndexC}</p>
      <p> heat Index (F) : {heatIndexF}</p>

      <p>Last updated (readable): {lastUpdated}</p>
      <p>Last updated (epoch): {lastUpdatedEpoch}</p>

      <p>Visibility (km): {visibilityKm}</p>
      <p>Visibility (miles): {visibilityMiles}</p>

      <p>Wind direction (degree): {windDegree}</p>
      <p>Wind direction (compass): {windDir}</p>

      <p>Wind speed (kph): {windKph}</p>
      <p>Wind speed (mph): {windMph}</p>

      <p>Wind chill (°C): {windChillC}</p>
      <p>Wind chill (°F): {windChillF}</p>

      <p>Atmospheric Pressure (in): {pressureIn}</p>
      <p>Atmospheric Pressure (mb): {pressureMb}</p>

      <p>Precipitation (in): {precipIn}</p>
      <p>Precipitation (mm): {precipMm}</p>

      <p>Humidity: {humidity}%</p>

      <p>Dew Point (°C): {dewPointC}</p>
      <p>Dew Point (°F): {dewPointF}</p>

      <p>Feels Like (°C): {feelsLikeC}</p>
      <p>Feels Like (°F): {feelsLikeF}</p>

      <p>Day or Night (1 = Day, 0 = Night): {isDay}</p>

      <p>Wind Gust (kph): {gustKph}</p>
      <p>Wind Gust (mph): {gustMph}</p>

      <form className="form" onSubmit={handelSubmit}>
        <input type="text"
          placeholder="city"
          name="city"
           onChange={handelChange}
        />
        <input type="text"
          placeholder="country"
          name="country"
          onChange={handelChangeCountry}
        />
        <button type="submit">Submit</button>
      </form>
      </div>
    </>
  )
}
export default App 