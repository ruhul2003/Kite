import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatar, bio, work, livesIn } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 100);

    const newUser = await User.create({
      name,
      username,
      email: email.toLowerCase(),
      password,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      bio: bio || 'Welcome to my Kite profile!',
      work: work || 'Community Member',
      livesIn: livesIn || 'San Francisco, CA',
      isGuest: false,
    });

    res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        coverPhoto: newUser.coverPhoto,
        bio: newUser.bio,
        work: newUser.work,
        livesIn: newUser.livesIn,
        isGuest: false,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials. Please check your email and password.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        coverPhoto: user.coverPhoto,
        bio: user.bio,
        work: user.work,
        livesIn: user.livesIn,
        isGuest: false,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Instant Guest Login
router.post('/guest', async (req, res) => {
  try {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const guestUser = {
      id: `guest-${Date.now()}`,
      name: `Guest Explorer #${randomNum}`,
      username: `guest_${randomNum}`,
      email: `guest${randomNum}@kite.local`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      bio: 'Exploring Kite as a guest ✨',
      work: 'Guest Visitor',
      livesIn: 'Everywhere',
      isGuest: true,
    };

    res.json({
      success: true,
      user: guestUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
