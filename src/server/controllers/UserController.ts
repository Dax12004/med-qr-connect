
import { Request, Response } from 'express';
import { User } from '../models/User';

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { username, email, password, role } = req.body;
      const user = await User.create({ username, email, password, role });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}
