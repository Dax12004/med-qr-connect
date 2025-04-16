
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const host = '0.0.0.0';

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Create PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.connect()
  .then(() => {
    console.log('Successfully connected to PostgreSQL');
  })
  .catch((error) => {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  });

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../../dist')));

app.use('/api/users', userRoutes);

// Test endpoint to check database connection
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'Database connected successfully', timestamp: result.rows[0].now });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'Database connection failed', error: error.message });
  }
});

// Serve the frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../../dist/index.html'));
});

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
