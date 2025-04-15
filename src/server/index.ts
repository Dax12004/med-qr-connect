
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
const host = '0.0.0.0';
const mongoUrl = process.env.MONGODB_URL;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

if (!mongoUrl) {
  console.error('MONGODB_URL environment variable is not set');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../../dist')));

app.use('/api/users', userRoutes);

// Test endpoint to check database connection
app.get('/api/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: 'Database connected successfully' });
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
