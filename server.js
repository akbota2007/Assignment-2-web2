require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Dynamic import for node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Keys from environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 1. Random User API Endpoint
app.get('/api/random-user', async (req, res) => {
  try {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const user = data.results[0];
      
      // Extract required data
      const userData = {
        firstName: user.name.first,
        lastName: user.name.last,
        gender: user.gender,
        picture: user.picture.large,
        age: user.dob.age,
        dateOfBirth: user.dob.date,
        city: user.location.city,
        country: user.location.country,
        address: `${user.location.street.number} ${user.location.street.name}`,
        email: user.email,
        phone: user.phone
      };
      
      res.json({ success: true, data: userData });
    } else {
      res.status(404).json({ success: false, message: 'No user data found' });
    }
  } catch (error) {
    console.error('Error fetching random user:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user data', error: error.message });
  }
});

// 2. REST Countries API Endpoint
app.get('/api/country/:countryName', async (req, res) => {
  try {
    const countryName = req.params.countryName;
    const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=false`);
    
    if (!response.ok) {
      return res.status(404).json({ success: false, message: 'Country not found' });
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const country = data[0];
      
      // Extract required data with fallbacks
      const countryData = {
        name: country.name.common || 'N/A',
        capital: country.capital ? country.capital[0] : 'N/A',
        languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A',
        currency: country.currencies ? Object.keys(country.currencies)[0] : 'N/A',
        currencyName: country.currencies ? Object.values(country.currencies)[0].name : 'N/A',
        currencySymbol: country.currencies ? Object.values(country.currencies)[0].symbol : '',
        flag: country.flags.svg || country.flags.png,
        population: country.population || 0,
        region: country.region || 'N/A'
      };
      
      res.json({ success: true, data: countryData });
    } else {
      res.status(404).json({ success: false, message: 'Country data not available' });
    }
  } catch (error) {
    console.error('Error fetching country data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch country data', error: error.message });
  }
});

// 3. Exchange Rate API Endpoint
app.get('/api/exchange-rate/:currency', async (req, res) => {
  try {
    const baseCurrency = req.params.currency.toUpperCase();
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    
    if (!response.ok) {
      return res.status(404).json({ success: false, message: 'Exchange rate not found' });
    }
    
    const data = await response.json();
    
    if (data && data.rates) {
      const exchangeData = {
        base: data.base,
        usdRate: data.rates.USD || 'N/A',
        kztRate: data.rates.KZT || 'N/A',
        date: data.date || new Date().toISOString().split('T')[0]
      };
      
      res.json({ success: true, data: exchangeData });
    } else {
      res.status(404).json({ success: false, message: 'Exchange rate data not available' });
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch exchange rate', error: error.message });
  }
});

// 4. News API Endpoint
app.get('/api/news/:country', async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'News API key not configured. Please add NEWS_API_KEY to your .env file' 
      });
    }
    
    const country = req.params.country;
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(country)}&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'ok' && data.articles) {
      // Filter and clean articles
      const articles = data.articles.slice(0, 5).map(article => ({
        title: article.title || 'No title available',
        description: article.description || 'No description available',
        image: article.urlToImage || null,
        url: article.url,
        source: article.source.name || 'Unknown source',
        publishedAt: article.publishedAt
      }));
      
      res.json({ success: true, data: articles });
    } else {
      res.json({ 
        success: false, 
        message: data.message || 'No news articles found for this country',
        data: []
      });
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch news', 
      error: error.message,
      data: []
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`NEWS_API_KEY configured: ${NEWS_API_KEY ? 'Yes' : 'No - Please add to .env file'}`);
});
