
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGODB_URL;

// Connect to MongoDB
import { User } from './models/User';

// Initialize database tables
User.createTable()
  .then(() => {
    console.log('Database tables initialized');
  })
  .catch((error) => {
    console.error('Database initialization error:', error);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
