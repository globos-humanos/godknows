import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from "url";
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(UPLOAD_DIR));
// Setup MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/recallpg';
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tutor', tutorRoutes);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
