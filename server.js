require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Temporary backup array (Agar database connect na ho to yahan save hoga)
let backupHistory = [];

const dbURI = process.env.MONGO_URI;

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
  if (!city) {
    return res.status(400).json({ error: "City name is required" });
  }

  try {
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=719df68903e144a29a0120015241606&q=${city}`);
    
    const weatherLog = {
      city: response.data.location.name,
      country: response.data.location.country,
      temp: `${response.data.current.temp_c}°C`,
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

    res.json(response.data);
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