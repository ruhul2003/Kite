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

// POST /api/notes - Create a new user note
router.post('/', async (req, res) => {
  try {
    const {
      userId = 'user-alex',
      title,
      content = '',
      color = 'slate',
      category = 'General',
      tags = [],
      isPinned = false,
      checklist = [],
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Note title is required' });
    }

    // Format checklist items with stable unique ids
    const sanitizedChecklist = Array.isArray(checklist)
      ? checklist
          .filter((item) => item && item.text && item.text.trim())
          .map((item, index) => ({
            id: item.id || `chk-${Date.now()}-${index}`,
            text: item.text.trim(),
            completed: Boolean(item.completed),
          }))
      : [];

    const newNote = await Note.create({
      userId,
      title: title.trim(),
      content: content.trim(),
      color,
      category,
      tags: Array.isArray(tags) ? tags.map((t) => t.trim()).filter(Boolean) : [],
      isPinned: Boolean(isPinned),
      checklist: sanitizedChecklist,
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note: newNote,
    });
  } catch (err) {
    console.error('Error creating note:', err.message);
    res.status(500).json({ success: false, error: 'Failed to create note' });
  }
});

// PUT /api/notes/:id - Update an existing note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, color, category, tags, isPinned, checklist } = req.body;

    const existingNote = await Note.findById(id);
    if (!existingNote) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    if (title !== undefined) existingNote.title = title.trim();
    if (content !== undefined) existingNote.content = content.trim();
    if (color !== undefined) existingNote.color = color;
    if (category !== undefined) existingNote.category = category;
    if (isPinned !== undefined) existingNote.isPinned = Boolean(isPinned);
    if (Array.isArray(tags)) {
      existingNote.tags = tags.map((t) => t.trim()).filter(Boolean);
    }
    if (Array.isArray(checklist)) {
      existingNote.checklist = checklist
        .filter((item) => item && item.text && item.text.trim())
        .map((item, index) => ({
          id: item.id || `chk-${Date.now()}-${index}`,
          text: item.text.trim(),
          completed: Boolean(item.completed),
        }));
    }

    const updatedNote = await existingNote.save();

    res.json({
      success: true,
      message: 'Note updated successfully',
      note: updatedNote,
    });
  } catch (err) {
    console.error('Error updating note:', err.message);
    res.status(500).json({ success: false, error: 'Failed to update note' });
  }
});

// PATCH /api/notes/:id/pin - Toggle pin status
router.patch('/:id/pin', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.json({
      success: true,
      message: note.isPinned ? 'Note pinned to top' : 'Note unpinned',
      note,
    });
  } catch (err) {
    console.error('Error toggling pin:', err.message);
    res.status(500).json({ success: false, error: 'Failed to toggle pin status' });
  }
});

export default router;
