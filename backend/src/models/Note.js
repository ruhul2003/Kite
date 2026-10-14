import mongoose from 'mongoose';

const ChecklistItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
});

const NoteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '', trim: true },
    color: {
      type: String,
      enum: ['slate', 'amber', 'emerald', 'sky', 'purple', 'rose'],
      default: 'slate',
    },
    category: {
      type: String,
      enum: ['General', 'Work', 'Personal', 'Ideas', 'Code', 'Todo'],
      default: 'General',
    },
    tags: [{ type: String, trim: true }],
    isPinned: { type: Boolean, default: false },
    checklist: [ChecklistItemSchema],
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound indexes for fast filtered lookups by user and pin status
NoteSchema.index({ userId: 1, isPinned: -1, createdAt: -1 });
NoteSchema.index({ userId: 1, category: 1 });
NoteSchema.index({ tags: 1 });

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
