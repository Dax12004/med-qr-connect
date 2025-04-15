
import { BaseModel } from './BaseModel';

export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export class User extends BaseModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL
      )`;
    await this.query(query);
  }

  static async create(user: IUser) {
    const { username, email, password, role } = user;
    const query = 'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [username, email, password, role];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email: string) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id: number) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.query(query, [id]);
    return result.rows[0];
  }
}
