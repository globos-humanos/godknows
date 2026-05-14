import mongoose, { Schema } from 'mongoose';
const SubjectSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    color: { type: String },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Subject', SubjectSchema);
