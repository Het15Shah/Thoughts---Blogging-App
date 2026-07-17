import Follow from '../models/Follow.js';
import Bookmark from '../models/Bookmark.js';
import HiddenPost from '../models/HiddenPost.js';

export const toggleFollow = async (req, res, next) => {
  try {
    const { authorName } = req.body; // Using authorName since frontend uses name
    if (!authorName) return res.status(400).json({ message: 'authorName is required' });

    const existing = await Follow.findOne({ followerId: req.user._id, followingName: authorName });

    if (existing) {
      await existing.deleteOne();
      res.json({ message: 'Unfollowed successfully' });
    } else {
      await Follow.create({ followerId: req.user._id, followingName: authorName });
      res.status(201).json({ message: 'Followed successfully' });
    }
  } catch (error) {
    next(error);
  }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    const { postId } = req.body;
    if (!postId) return res.status(400).json({ message: 'postId is required' });

    const existing = await Bookmark.findOne({ userId: req.user._id, postId });

    if (existing) {
      await existing.deleteOne();
      res.json({ message: 'Bookmark removed' });
    } else {
      await Bookmark.create({ userId: req.user._id, postId });
      res.status(201).json({ message: 'Bookmarked successfully' });
    }
  } catch (error) {
    next(error);
  }
};

export const toggleHide = async (req, res, next) => {
  try {
    const { postId } = req.body;
    if (!postId) return res.status(400).json({ message: 'postId is required' });

    const existing = await HiddenPost.findOne({ userId: req.user._id, postId });

    if (existing) {
      await existing.deleteOne();
      res.json({ message: 'Post unhidden' });
    } else {
      await HiddenPost.create({ userId: req.user._id, postId });
      res.status(201).json({ message: 'Post hidden successfully' });
    }
  } catch (error) {
    next(error);
  }
};

export const getPreferences = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [follows, bookmarks, hiddenPosts] = await Promise.all([
      Follow.find({ followerId: userId }).select('followingName -_id'),
      Bookmark.find({ userId }).select('postId -_id'),
      HiddenPost.find({ userId }).select('postId -_id'),
    ]);

    res.json({
      following: follows.map(f => f.followingName),
      bookmarks: bookmarks.map(b => b.postId),
      hidden: hiddenPosts.map(h => h.postId),
    });
  } catch (error) {
    next(error);
  }
};
