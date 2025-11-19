// server.js - Backend API using @tobyg74/tiktok-api-dl
const express = require('express');
const cors = require('cors');
const Tiktok = require('@tobyg74/tiktok-api-dl');
const path = require('path'); // <-- ADD THIS LINE

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ++ ADD THIS SECTION TO SERVE FRONTEND FILES ++
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// ++ END OF NEW SECTION ++

// API Documentation endpoint
app.get('/api/docs', (req, res) => {
  // ... (your existing /api/docs code)
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  // ... (your existing /api/health code)
});

// Main download endpoint
app.post('/api/download', async (req, res) => {
  // ... (your existing /api/download code)
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found. Visit /api/docs for API documentation'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`TikTok Downloader API running on http://localhost:${PORT}`);
  // The line below is still correct, but you can also visit the root
  console.log(`Downloader App: http://localhost:${PORT}/`);
  console.log(`API Documentation App: http://localhost:${PORT}/docs.html`);
  console.log(`API JSON: http://localhost:${PORT}/api/docs`);
});

// Export for testing
module.exports = app;
