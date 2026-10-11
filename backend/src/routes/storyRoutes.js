import express from 'express';
import { Story } from '../models/Story.js';

const router = express.Router();

// Get active stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new story
router.post('/', async (req, res) => {
  try {
    const { authorName, authorAvatar, storyMedia, caption } = req.body;
    if (!authorName || !storyMedia) {
      return res.status(400).json({ error: 'Author name and story media are required.' });
    }

    const story = await Story.create({
      authorName,
      authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      storyMedia,
      caption: caption || '',
    });

    res.status(201).json({ success: true, story });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
