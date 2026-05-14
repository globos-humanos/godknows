import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Document from '../models/Document.js';
import { authenticateJWT, AuthRequest } from '../middleware/authMiddleware.js';
import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../../uploads');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/upload', authenticateJWT, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, subjectId } = req.body;

    const newDocument = new Document({
      userId: req.userId,
      subjectId: subjectId || null,
      title: title || req.file.originalname,
      originalFileName: req.file.originalname,
      filePath: req.file.path,
      processingStatus: 'Uploaded'
    });

    await newDocument.save();

    // Trigger python worker processing asynchronously
    try {
      const workerUrl = process.env.WORKER_URL || 'http://localhost:8000';
      axios.post(`${workerUrl}/worker/process-document`, {
        documentId: newDocument._id,
        userId: req.userId,
        filePath: req.file.path
      }).catch(err => console.error("Error triggering worker:", err.message));
    } catch (err) {
      console.error("Failed to call worker:", err);
    }

    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const documents = await Document.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/status', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, userId: req.userId });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ status: document.processingStatus, errors: document.processingErrors });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

// Webhook endpoint for the Python worker to send chunks back
router.post('/:id/chunks', async (req, res) => {
  try {
    const documentId = req.params.id;
    const { userId, chunks, status } = req.body;

    const Document = (await import('../models/Document.js')).default;
    const Chunk = (await import('../models/Chunk.js')).default;

    // Update document status
    await Document.findByIdAndUpdate(documentId, { processingStatus: status || 'Ready' });

    if (chunks && chunks.length > 0) {
      // Format chunks for insertion
      const formattedChunks = chunks.map((chunk: any) => ({
        userId,
        documentId,
        pageNumberStart: chunk.page_number,
        pageNumberEnd: chunk.page_number,
        text: chunk.text,
        topic: chunk.topic,
        sourceType: chunk.source_type,
        confidence: chunk.confidence
      }));

      await Chunk.insertMany(formattedChunks);
    }

    res.status(200).json({ message: 'Chunks saved successfully' });
  } catch (error) {
    console.error("Error saving chunks from worker:", error);
    res.status(500).json({ message: 'Server error' });
  }
});
