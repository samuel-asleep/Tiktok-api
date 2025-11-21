const express = require('express');
const Tiktok = require('@tobyg74/tiktok-api-dl');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 100;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  // Filter out old requests
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

// API Routes
app.get('/api/download', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        status: 'error',
        message: 'Rate limit exceeded. Please try again later.'
      });
    }

    const { url, version = 'v1' } = req.query;
    
    if (!url) {
      return res.status(400).json({
        status: 'error',
        message: 'URL parameter is required'
      });
    }

    if (!url.includes('tiktok.com')) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid TikTok URL'
      });
    }

    const result = await Tiktok.Downloader(url, { version });
    
    if (result.status === 'error') {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch video information',
      error: error.message
    });
  }
});

app.post('/api/download', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        status: 'error',
        message: 'Rate limit exceeded. Please try again later.'
      });
    }

    const { url, version = 'v1' } = req.body;
    
    if (!url) {
      return res.status(400).json({
        status: 'error',
        message: 'URL is required in request body'
      });
    }

    if (!url.includes('tiktok.com')) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid TikTok URL'
      });
    }

    const result = await Tiktok.Downloader(url, { version });
    
    if (result.status === 'error') {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch video information',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 TikTok Downloader API running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api/download`);
});