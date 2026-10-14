import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

// Seed notes for initial environment bootstrap
export const SEED_NOTES = [
  {
    userId: 'user-alex',
    title: 'Kite v2 Launch Checklist 🚀',
    content: 'Final tasks before presenting Kite to the community. Ensure responsive layouts and dark mode are fully polished.',
    color: 'emerald',
    category: 'Work',
    tags: ['Launch', 'Production', 'NextJS'],
    isPinned: true,
    checklist: [
      { id: 'chk-1', text: 'Validate Next.js App Router performance and hydration', completed: true },
      { id: 'chk-2', text: 'Test Socket.io messaging across multiple browser tabs', completed: true },
      { id: 'chk-3', text: 'Check dark mode contrast on all feed post reaction cards', completed: true },
      { id: 'chk-4', text: 'Implement interactive note scratchpad hub', completed: true },
      { id: 'chk-5', text: 'Prepare community demo video', completed: false },
    ],
  },
  {
    userId: 'user-alex',
    title: 'UI Design Inspiration & Palette 🎨',
    content: 'Tailwind CSS v4 modern palette tokens. Combine clean slate borders with vibrant accent gradients for glassmorphism modals.',
    color: 'purple',
    category: 'Ideas',
    tags: ['Design', 'Tailwind', 'Aesthetics'],
    isPinned: true,
    checklist: [],
  },
  {
    userId: 'user-alex',
    title: 'Weekly Workout & Reading Routine 📚',
    content: 'Morning 20-minute run followed by reading 15 pages of Designing Data-Intensive Applications.',
    color: 'amber',
    category: 'Personal',
    tags: ['Habits', 'Health'],
    isPinned: false,
    checklist: [
      { id: 'chk-6', text: 'Morning stretch and 5k run', completed: true },
      { id: 'chk-7', text: 'Read Chapter 4: Encoding and Evolution', completed: false },
      { id: 'chk-8', text: 'Hydrate: 3L water target', completed: true },
    ],
  },
  {
    userId: 'user-alex',
    title: 'MongoDB Aggregation Query Snippets 💻',
    content: 'Remember to always place $match stages before $group to leverage indexed queries efficiently.',
    color: 'sky',
    category: 'Code',
    tags: ['Database', 'MongoDB', 'Performance'],
    isPinned: false,
    checklist: [],
  },
];

// GET /api/notes - Retrieve notes with optional search, category, and pin filtering
router.get('/', async (req, res) => {
  try {
    const { userId = 'user-alex', category, search, tag } = req.query;

    const query = { userId, isArchived: false };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
        { 'checklist.text': searchRegex },
      ];
    }

    let notes = await Note.find(query).sort({ isPinned: -1, createdAt: -1 });

    // Seed notes automatically if database has no notes for user yet
    if (notes.length === 0 && !search && (!category || category === 'All') && !tag) {
      const existingCount = await Note.countDocuments({ userId });
      if (existingCount === 0) {
        await Note.insertMany(SEED_NOTES.map((n) => ({ ...n, userId })));
        notes = await Note.find(query).sort({ isPinned: -1, createdAt: -1 });
      }
    }

    res.json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (err) {
    console.error('Error fetching notes:', err.message);
    res.status(500).json({ success: false, error: 'Failed to retrieve notes' });
  }
});

export default router;
