import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    author: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      avatar: { type: String, required: true },
      isVerified: { type: Boolean, default: false },
    },
    content: {
      type: String,
      default: '',
    },
    bgGradient: {
      type: String,
      default: null,
    },
    feeling: {
      emoji: { type: String, default: null },
      text: { type: String, default: null },
    },
    privacy: {
      type: String,
      enum: ['public', 'friends', 'only_me'],
      default: 'public',
    },
    media: [
      {
        type: { type: String, default: 'image' },
        url: { type: String, required: true },
        caption: { type: String, default: '' },
      },
    ],
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      care: { type: Number, default: 0 },
      haha: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
    },
    comments: [commentSchema],
    sharesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
