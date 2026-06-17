const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Temporary backup array (Agar cloud internet block ho to search history yahan save hogi)
let backupHistory = [];

const dbURI = "mongodb+srv://aimanfatima888786_db_user:fsha7654@cluster0.wdsyhcq.mongodb.net/weatherDB?retryWrites=true&w=majority&appName=Cluster0";

// Database Connection with catch block that doesn't halt the app
mongoose.connect(dbURI, {
  serverSelectionTimeoutMS: 5000, // Sirf 5 seconds wait karega, hang nahi hoga
})
.then(() => console.log("🟢 MongoDB Atlas Connected Successfully!"))
.catch((err) => {
  console.log("⚠️ MongoDB Connect nahi ho saka (Network Blocked). Using Local Backup Mode!");
});

// Mongoose Schema
const searchHistorySchema = new mongoose.Schema({
  city: String,
  country: String,
  temp: String,
  searchedAt: { type: Date, default: Date.now }
});

const History = mongoose.model('History', searchHistorySchema);

// 3. Weather Route: Fetch also saves data intelligently
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  try {
    const response = await axios.get(`https://p2pclouds.up.railway.app/v1/learn/weather?city=${city}`);
    
    const weatherLog = {
      city: response.data.location.name,
      country: response.data.location.country,
      temp: `${response.data.current.temp_c}°C`,
      searchedAt: new Date()
    };

    // Try saving to MongoDB, if fails, save to Backup Array
    if (mongoose.connection.readyState === 1) {
      const newSearch = new History(weatherLog);
      await newSearch.save().catch(e => console.log("Save error"));
    } else {
      backupHistory.unshift(weatherLog);
      if (backupHistory.length > 5) backupHistory.pop();
    }

    res.json(response.data);
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    res.status(500).json({ error: "Weather data fetch nahi ho saka" });
  }
});

// 4. History Route: Smart Fetch
app.get('/api/history', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const allHistory = await History.find().sort({ searchedAt: -1 }).limit(5);
      res.json(allHistory);
    } else {
      res.json(backupHistory); // Return backup data if offline
    }
  } catch (error) {
    res.status(500).json({ error: "History fetch nahi ho saki" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));