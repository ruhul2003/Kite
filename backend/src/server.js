import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Kite API',
    uptime: `${Math.floor(process.uptime())}s`,
    message: 'Backend server is running smoothly',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'Kite Backend Service',
    version: '1.0.0',
    framework: 'Express 4.21',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.post('/api/echo', (req, res) => {
  res.json({
    status: 'received',
    data: req.body,
    receivedAt: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('Kite API is running. Visit /api/health for system status.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
