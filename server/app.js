import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import plotRoutes from './routes/plotRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Enable CORS for frontend communication
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware to ensure DB connection on request (essential for Vercel serverless functions)
// NOTE: Seeding is NOT done here — it's done separately via the seed script.
// Doing it per-request caused timeout/cancellation issues in production.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database middleware connection error:', err);
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please try again shortly.'
    });
  }
});

// Root API status endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Shreemant Jagadevrao Deshmukh Layout API Server Running',
    version: '1.0.0'
  });
});

// API Routers
app.use('/api/plots', plotRoutes);
app.use('/api/auth', authRoutes);

// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API route '${req.originalUrl}' not found`
    });
  }
  next();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
