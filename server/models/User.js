import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    socialLinks: {
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
