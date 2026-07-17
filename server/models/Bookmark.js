import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    postId: {
      type: String, // String to accommodate either ObjectId or slug-based references used in frontend
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
