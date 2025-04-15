
import mongoose from 'mongoose';
import { BaseModel } from './BaseModel';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true }
});

const UserModel = mongoose.model('User', userSchema);

export class User extends BaseModel {
  static async findById(id: string): Promise<IUser | null> {
    await this.connect();
    return UserModel.findById(id);
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    await this.connect();
    return UserModel.findOne({ email });
  }
}
