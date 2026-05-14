import mongoose, { Schema } from 'mongoose';
const PageSchema = new Schema({
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
export default mongoose.model('Page', PageSchema);
