import mongoose from 'mongoose';

const followSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    followingName: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate follows
followSchema.index({ followerId: 1, followingName: 1 }, { unique: true });

const Follow = mongoose.model('Follow', followSchema);
export default Follow;
