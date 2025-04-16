
import mongoose from 'mongoose';

export class BaseModel {
  static async connect() {
    try {
      const mongoUrl = process.env.MONGODB_URL;
      if (!mongoUrl) {
        throw new Error('MongoDB URL not found in environment variables');
      }
      await mongoose.connect(mongoUrl);
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }
}
