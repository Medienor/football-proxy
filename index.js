const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'https://tvtilbud.no/'
}));

app.get('/api/football/:competition', async (req, res) => {
  try {
    const { competition } = req.params;
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${competition}/matches?status=SCHEDULED,TIMED,LIVE`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 