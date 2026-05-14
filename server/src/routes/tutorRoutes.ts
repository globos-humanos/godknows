import express from 'express';
import axios from 'axios';
import { authenticateJWT, AuthRequest } from '../middleware/authMiddleware.js';

const router = express.Router();
const workerUrl = process.env.WORKER_URL || 'http://localhost:8000';

router.post('/teach', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { documentId, topic, context } = req.body;

    const response = await axios.post(`${workerUrl}/worker/teach`, {
      userId: req.userId,
      documentId,
      topic,
      context
    });

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: 'Error communicating with AI worker', error: error.message });
  }
});

export default router;

router.post('/chat', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { documentId, query } = req.body;

    const response = await axios.post(`${workerUrl}/worker/chat`, {
      userId: req.userId,
      documentId,
      query
    });

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: 'Error communicating with AI worker', error: error.message });
  }
});

router.post('/generate-mcqs', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { documentId, topic, count } = req.body;

    const response = await axios.post(`${workerUrl}/worker/generate-mcqs`, {
      userId: req.userId,
      documentId,
      topic,
      count
    });

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: 'Error communicating with AI worker', error: error.message });
  }
});
