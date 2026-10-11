import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: true,
    },
    authorAvatar: {
      type: String,
      required: true,
    },
    storyMedia: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      index: { expires: '24h' },
    },
  },
  {
    timestamps: true,
  }
);

export const Story = mongoose.models.Story || mongoose.model('Story', storySchema);
