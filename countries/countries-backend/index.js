require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/config', (req, res) => {
  const apiKey = process.env.VITE_SOME_KEY;
  res.json({ apiKey });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});