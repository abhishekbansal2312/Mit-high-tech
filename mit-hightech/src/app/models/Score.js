import mongoose from 'mongoose';

// Check if the Score model already exists to prevent OverwriteModelError
const Score = mongoose.models.Score || mongoose.model('Score', new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  score: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}));

export default Score;