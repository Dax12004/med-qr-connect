
import mongoose from 'mongoose';

export class BaseModel {
  static async connect() {
    if (!process.env.MONGODB_URL) {
      throw new Error('MONGODB_URL environment variable is not set');
    }
    
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }
}
