import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    examTarget: { type: String, default: 'NEET-PG 2026' },
    targetExamDate: { type: Date },
    settings: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('User', UserSchema);
