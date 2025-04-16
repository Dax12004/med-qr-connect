
import { pool } from '../index';

export class User {
  static async findById(id: string) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async find(query = {}) {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  }

  static async create(user: { username: string; email: string; password: string; role: string }) {
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [user.username, user.email, user.password, user.role]
    );
    return result.rows[0];
  }
}
