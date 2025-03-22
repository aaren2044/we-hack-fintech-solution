import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
}));
app.use(express.json());

app.get('/fetchBanks', async (req, res) => {
  const location = req.query.location;
  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }

  try {
    const apiKey = process.env.SERP_API_KEY; // Ensure this is set in .env
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_maps&q=microfinance+banks+in+${location}&hl=en&api_key=${apiKey}`
    );
    const data = await response.json();

    if (data.local_results) {
      res.json({ banks: data.local_results });
    } else {
      res.status(404).json({ error: 'No results found' });
    }
  } catch (error) {
    console.error("Error fetching banks:", error);
    res.status(500).json({ error: 'Failed to fetch data from SerpAPI' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});