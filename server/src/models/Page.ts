import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
  userId: mongoose.Types.ObjectId;
  documentId: mongoose.Types.ObjectId;
  pageNumber: number;
  pageImagePath: string;
  selectableText?: string;
  printedText?: string;
  handwrittenText?: string;
  ocrConfidence?: number;
  hasHandwriting?: boolean;
  hasFigures?: boolean;
  needsReview?: boolean;
  createdAt: Date;
}

const PageSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
  pageNumber: { type: Number, required: true },
  pageImagePath: { type: String, required: true },
  selectableText: { type: String },
  printedText: { type: String },
  handwrittenText: { type: String },
  ocrConfidence: { type: Number },
  hasHandwriting: { type: Boolean, default: false },
  hasFigures: { type: Boolean, default: false },
  needsReview: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPage>('Page', PageSchema);
