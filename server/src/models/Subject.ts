import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
}

const SubjectSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  color: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISubject>('Subject', SubjectSchema);
