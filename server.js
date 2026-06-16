const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Temporary backup array (Agar database connect na ho to yahan save hoga)
let backupHistory = [];

const dbURI = "mongodb+srv://aimanfatima888786_db_user:fsha7654@cluster0.wdsyhcq.mongodb.net/weatherDB?retryWrites=true&w=majority&appName=Cluster0";

// Database Connection
mongoose.connect(dbURI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => console.log("🟢 MongoDB Atlas Connected Successfully!"))
.catch((err) => {
  console.log("⚠️ MongoDB Connect nahi ho saka. Using Local Backup Mode!");
});

// Mongoose Schema
const searchHistorySchema = new mongoose.Schema({
  city: String,
  country: String,
  temp: String,
  searchedAt: { type: Date, default: Date.now }
});

const History = mongoose.model('History', searchHistorySchema);

// 1. Weather Route: Fetch global data 
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  try {
    // Global Weather API (Poori duniya ka data dene ke liye)
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=719df68903e144a29a0120015241606&q=${city}`);
    
    
    const customResponse = {
      location: {
        name: response.data.location.name,
        country: response.data.location.country
      },
      current: {
        temp_c: response.data.current.temp_c,
        temp_f: response.data.current.temp_f,
        feelslike_c: response.data.current.feelslike_c,
        feelslike_f: response.data.current.feelslike_f,
        humidity: response.data.current.humidity,
        wind_kph: response.data.current.wind_kph,
        wind_dir: response.data.current.wind_dir
      }
    };

    const weatherLog = {
      city: customResponse.location.name,
      country: customResponse.location.country,
      temp: `${customResponse.current.temp_c}°C`,
      searchedAt: new Date()
    };

    // Data History mein save karna
    if (mongoose.connection.readyState === 1) {
      const newSearch = new History(weatherLog);
      await newSearch.save().catch(e => console.log("Save error:", e.message));
    } else {
      backupHistory.unshift(weatherLog);
      if (backupHistory.length > 5) backupHistory.pop();
    }

    res.json(customResponse);
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    res.status(404).json({ error: "City not found or API Error" });
  }
});

// 2. History Route
app.get('/api/history', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const allHistory = await History.find().sort({ searchedAt: -1 }).limit(5);
      res.json(allHistory);
    } else {
      res.json(backupHistory);
    }
  } catch (error) {
    res.status(500).json({ error: "History fetch nahi ho saki" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));