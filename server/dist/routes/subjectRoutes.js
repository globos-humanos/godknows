import express from 'express';
import Subject from '../models/Subject.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', authenticateJWT, async (req, res) => {
    try {
        const { name, description, color } = req.body;
        const newSubject = new Subject({
            userId: req.userId,
            name,
            description,
            color
        });
        await newSubject.save();
        res.status(201).json(newSubject);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const subjects = await Subject.find({ userId: req.userId }).sort({ name: 1 });
        res.json(subjects);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
export default router;
