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

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const username =
      normalizedEmail.split('@')[0].replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 100);

    user = await User.create({
      name: name.trim(),
      username,
      email: normalizedEmail,
      password,
      avatar:
        avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      coverPhoto:
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      bio: bio?.trim() || 'Welcome to my Kite profile!',
      work: work?.trim() || 'Community Member',
      livesIn: livesIn?.trim() || 'San Francisco, CA',
      isGuest: false,
    });

    console.log(`User registered and saved to MongoDB (Kite.users): ${user.email}`);

    res.status(201).json({
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
    console.error('Register error:', error.message);
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

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ error: 'No account found with this email. Please sign up.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    console.log(`User logged in from MongoDB: ${user.email}`);

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
        isGuest: user.isGuest || false,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Google Sign-In: Find or Create User in MongoDB
router.post('/google', async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Google email is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const username =
        normalizedEmail.split('@')[0].replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 100);

      user = await User.create({
        name: name || 'Google User',
        username,
        email: normalizedEmail,
        password: `google_oauth_${Date.now()}`,
        avatar:
          avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        coverPhoto:
          'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
        bio: `Signed in with Google Account (${normalizedEmail}) 🌐`,
        work: 'Google Verified Member',
        livesIn: 'Everywhere',
        isGuest: false,
      });

      console.log(`New Google user saved to MongoDB (Kite.users): ${user.email}`);
    } else {
      console.log(`Existing Google user retrieved from MongoDB: ${user.email}`);
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
    console.error('Google auth error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Guest Login: Save guest user to MongoDB
router.post('/guest', async (req, res) => {
  try {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const guestUser = await User.create({
      name: `Guest Explorer #${randomNum}`,
      username: `guest_${randomNum}_${Date.now().toString().slice(-4)}`,
      email: `guest${randomNum}_${Date.now().toString().slice(-4)}@kite.local`,
      password: 'guest_access_token',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      coverPhoto:
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      bio: 'Exploring Kite as a guest ✨',
      work: 'Guest Visitor',
      livesIn: 'Everywhere',
      isGuest: true,
    });

    console.log(`Guest user saved to MongoDB (Kite.users): ${guestUser.email}`);

    res.status(201).json({
      success: true,
      user: {
        id: guestUser._id,
        name: guestUser.name,
        username: guestUser.username,
        email: guestUser.email,
        avatar: guestUser.avatar,
        coverPhoto: guestUser.coverPhoto,
        bio: guestUser.bio,
        work: guestUser.work,
        livesIn: guestUser.livesIn,
        isGuest: true,
      },
    });
  } catch (error) {
    console.error('Guest auth error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
