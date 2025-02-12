const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Configure CORS to allow all origins during debugging
app.use(cors({
  origin: '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

app.get('/api/football/:competition', async (req, res) => {
  try {
    const { competition } = req.params;
    console.log(`[${new Date().toISOString()}] Fetching data for competition: ${competition}`);

    const apiUrl = `https://api.football-data.org/v4/competitions/${competition}/matches?status=SCHEDULED,TIMED,LIVE`;
    console.log('Calling external API:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY
      }
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully fetched data');

    // Set explicit CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');

    res.json(data);
  } catch (error) {
    console.error('Detailed server error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS enabled for all origins');
}); 