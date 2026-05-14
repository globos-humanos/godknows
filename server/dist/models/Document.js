import mongoose, { Schema } from 'mongoose';
const DocumentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    title: { type: String, required: true },
    originalFileName: { type: String, required: true },
    filePath: { type: String, required: true },
    totalPages: { type: Number },
    processingStatus: { type: String, default: 'Uploaded' },
    processingErrors: [{ type: String }],
}, { timestamps: true });
export default mongoose.model('Document', DocumentSchema);
