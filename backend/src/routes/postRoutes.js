import express from 'express';
import { Post } from '../models/Post.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { author, content, media, bgGradient, feeling, privacy } = req.body;

    if (!author || (!content && (!media || media.length === 0))) {
      return res.status(400).json({ error: 'Post must have an author and content or media.' });
    }

    const newPost = await Post.create({
      author,
      content: content || '',
      media: media || [],
      bgGradient: bgGradient || null,
      feeling: feeling || null,
      privacy: privacy || 'public',
      reactions: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      comments: [],
      sharesCount: 0,
    });

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// React to a post
router.post('/:id/react', async (req, res) => {
  try {
    const { reactionType } = req.body; // 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry'
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.reactions[reactionType] !== undefined) {
      post.reactions[reactionType] += 1;
      await post.save();
    }

    res.json({ success: true, reactions: post.reactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comment on a post
router.post('/:id/comment', async (req, res) => {
  try {
    const { author, content } = req.body;
    if (!author || !content) {
      return res.status(400).json({ error: 'Comment must have an author and text content.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const newComment = {
      author,
      content,
      likes: 0,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ success: true, comments: post.comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    res.json({ success: true, message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
