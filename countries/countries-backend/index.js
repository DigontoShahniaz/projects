// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const path = require('path'); // Add this line
const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint to fetch the API key
app.get('/api/config', (req, res) => {
  const apiKey = process.env.VITE_SOME_KEY;
  console.log('API Key from backend:', apiKey); // Debugging line
  res.json({ apiKey });
});

// Handle all other routes by serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});