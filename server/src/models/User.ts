import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  examTarget: string;
  targetExamDate?: Date;
  settings: Record<string, any>;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  examTarget: { type: String, default: 'NEET-PG 2026' },
  targetExamDate: { type: Date },
  settings: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
