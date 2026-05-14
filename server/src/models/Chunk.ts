import mongoose, { Schema, Document } from 'mongoose';

export interface IChunk extends Document {
  userId: mongoose.Types.ObjectId;
  documentId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  pageNumberStart: number;
  pageNumberEnd: number;
  text: string;
  topic?: string;
  sourceType: string;
  confidence: number;
  embedding?: number[];
  linkedFigureIds?: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const ChunkSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
  pageNumberStart: { type: Number, required: true },
  pageNumberEnd: { type: Number, required: true },
  text: { type: String, required: true },
  topic: { type: String },
  sourceType: { type: String, enum: ['selectableText', 'printedOCR', 'confirmedHandwriting', 'figureDescription', 'table', 'mixed'], required: true },
  confidence: { type: Number, required: true },
  embedding: [{ type: Number }],
  linkedFigureIds: [{ type: Schema.Types.ObjectId, ref: 'Figure' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IChunk>('Chunk', ChunkSchema);
