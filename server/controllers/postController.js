import Post from '../models/Post.js';

export const getPosts = async (req, res, next) => {
  try {
    const { status = 'active', tag } = req.query;
    let query = { status };

    if (tag) {
      query.tags = tag;
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });

    // Format like Appwrite response
    res.json({ documents: posts.map(p => ({ ...p._doc, $id: p._id })) });
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ $or: [{ _id: req.params.slug }, { slug: req.params.slug }] }).catch(() => null);
    if (post) {
      res.json({ ...post._doc, $id: post._id });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, slug, content, featuredImage, status, tag } = req.body;

    const tags = tag ? [tag] : []; // Convert legacy single tag to array

    const post = await Post.create({
      title,
      slug,
      content,
      featuredImage,
      status,
      tags,
      authorId: req.user._id,
      authorName: req.user.name,
    });

    res.status(201).json({ ...post._doc, $id: post._id });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { title, content, featuredImage, status, tag } = req.body;
    
    // In frontend we pass slug as the $id for updates, but in MongoDB we should find by slug or ID
    const post = await Post.findOne({ $or: [{ _id: req.params.slug }, { slug: req.params.slug }] }).catch(() => null);

    if (post) {
      // Check ownership
      if (post.authorId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this post' });
      }

      post.title = title || post.title;
      post.content = content || post.content;
      post.featuredImage = featuredImage || post.featuredImage;
      post.status = status || post.status;
      if (tag) post.tags = [tag];

      const updatedPost = await post.save();
      res.json({ ...updatedPost._doc, $id: updatedPost._id });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ $or: [{ _id: req.params.slug }, { slug: req.params.slug }] }).catch(() => null);

    if (post) {
      if (post.authorId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this post' });
      }

      await post.deleteOne();
      res.json({ message: 'Post removed' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    next(error);
  }
};
