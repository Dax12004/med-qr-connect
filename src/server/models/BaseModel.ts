
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export class BaseModel {
  protected static async connect() {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/medical-db';
    try {
      await mongoose.connect(mongoUrl);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }
}
