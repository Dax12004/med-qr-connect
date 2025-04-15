
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGODB_URL;

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

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
