require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// ensure uploads directory exists
fs.mkdirSync(path.join(__dirname, '../uploads'), { recursive: true });

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));  // high limit for any large JSON payloads (e.g. long descriptions)

// simple auth middleware that reads user id from Bearer token and attaches req.user
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer')) {
    const token = auth.replace(/^Bearer\s+/i, '');
    const userId = parseInt(token);
    if (!isNaN(userId)) {
      req.user = { id: userId };
    }
  }
  next();
});

// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// API Routes
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
