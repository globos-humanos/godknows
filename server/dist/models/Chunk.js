import mongoose, { Schema } from 'mongoose';
const ChunkSchema = new Schema({
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
export default mongoose.model('Chunk', ChunkSchema);
