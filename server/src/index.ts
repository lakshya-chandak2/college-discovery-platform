import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import collegeRoutes from './routes/colleges';
import savedRoutes from './routes/saved';
import compareRoutes from './routes/compare';

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS FIX (IMPORTANT)
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://college-discovery-platform-7bfc.onrender.com' // 👈 yaha apna actual Vercel URL daalna
  ],
  credentials: true
}));

// Middleware
app.use(express.json());

// Logger (optional but useful)
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/colleges', collegeRoutes);
app.use('/saved', savedRoutes);
app.use('/compare', compareRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root test (optional but useful)
app.get('/', (_req, res) => {
  res.send('API is running 🚀');
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;