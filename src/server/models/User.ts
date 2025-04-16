
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

export class User {
  static async findById(id: string) {
    return await UserModel.findById(id);
  }

  static async find(query = {}) {
    return await UserModel.find(query);
  }

  static async create(user: { username: string; email: string; password: string; role: string }) {
    const newUser = new UserModel(user);
    return await newUser.save();
  }
}
