
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class BaseModel {
  protected static pool: Pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}
