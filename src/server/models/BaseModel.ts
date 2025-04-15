
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class BaseModel {
  protected static pool: Pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  protected static async query(text: string, params?: any[]) {
    try {
      const result = await this.pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
}
