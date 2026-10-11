import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// Get suggested friends
router.get('/suggestions', async (req, res) => {
  try {
    const users = await User.find({ isGuest: false }).limit(10).select('-password');
    res.json({ success: true, suggestions: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept friend request
router.post('/accept', async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    res.json({ success: true, message: 'Friend request accepted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Decline friend request
router.post('/decline', async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    res.json({ success: true, message: 'Friend request declined.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
