
import mongoose from 'mongoose';

const qrScanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recordId: { type: String, required: true },
  scanTime: { type: Date, default: Date.now },
  location: {
    latitude: Number,
    longitude: Number
  }
}, { timestamps: true });

const QrScanModel = mongoose.model('QrScan', qrScanSchema);

export class QrScan {
  static async create(scanData: { userId: string; recordId: string; location?: { latitude: number; longitude: number } }) {
    const newScan = new QrScanModel(scanData);
    return await newScan.save();
  }

  static async findByUserId(userId: string) {
    return await QrScanModel.find({ userId }).sort({ scanTime: -1 });
  }
}
