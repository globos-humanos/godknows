import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  userId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  title: string;
  originalFileName: string;
  filePath: string;
  totalPages?: number;
  processingStatus: string;
  processingErrors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
  title: { type: String, required: true },
  originalFileName: { type: String, required: true },
  filePath: { type: String, required: true },
  totalPages: { type: Number },
  processingStatus: { type: String, default: 'Uploaded' },
  processingErrors: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<IDocument>('Document', DocumentSchema);
