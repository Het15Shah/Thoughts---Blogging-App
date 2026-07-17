import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      default: '',
    },
    featuredImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'published', 'draft'],
      default: 'active',
      index: true,
    },
    tags: {
      type: [String],
      validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
      index: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    clapCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length <= 5;
}

// Full Text Search Index
postSchema.index({ title: 'text', content: 'text' });

const Post = mongoose.model('Post', postSchema);
export default Post;
