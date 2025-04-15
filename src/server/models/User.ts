
import { BaseModel } from './BaseModel';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export class User extends BaseModel {
  static async findById(id: string): Promise<IUser | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }
}
