const Post = require("../models/Post.model");

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const { text, emojis, imageUrl, poll } = req.body;

    if (!text && !imageUrl && !poll) {
      return res
        .status(400)
        .json({ message: "Post must have text, image, or poll" });
    }

    const newPost = await Post.create({
      userId: req.user.id,
      username: req.user.username,
      text,
      emojis,
      imageUrl,
      poll,
      likes: [],
      comments: [],
      shares: []
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET FEED WITH FILTERS + PAGINATION
exports.getFeed = async (req, res) => {
  try {
    const {
      filter = "all",
      page = 1,
      limit = 5
    } = req.query;

    const skip = (page - 1) * limit;

    let sortQuery = { createdAt: -1 };

    if (filter === "mostLiked") {
      sortQuery = { "likes.length": -1 };
    }

    if (filter === "mostCommented") {
      sortQuery = { "comments.length": -1 };
    }

    if (filter === "mostShared") {
      sortQuery = { "shares.length": -1 };
    }

    if (filter === "forYou") {
      sortQuery = {
        createdAt: -1,
        "likes.length": -1
      };
    }

    const posts = await Post.find()
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalPosts = await Post.countDocuments();

    const formattedPosts = posts.map((post) => ({
      ...post,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      sharesCount: post.shares.length,
      likesUsers: (post.likes || [])
        .map((like) => (typeof like === "string" ? null : like.username))
        .filter(Boolean)
    }));

    res.json({
      page: Number(page),
      limit: Number(limit),
      totalPosts,
      hasMore: skip + posts.length < totalPosts,
      posts: formattedPosts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LIKE / UNLIKE POST
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    const existingIndex = post.likes.findIndex((like) => {
      if (typeof like === "string") {
        return like.toString() === userId.toString();
      }
      return like.userId?.toString() === userId.toString();
    });

    if (existingIndex >= 0) {
      post.likes = post.likes.filter((like, index) => index !== existingIndex);
    } else {
      post.likes.push({ userId, username: req.user.username });
    }

    await post.save();

    res.json({
      message: "Like updated",
      likesCount: post.likes.length,
      likes: post.likes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      userId: req.user.id,
      username: req.user.username,
      text
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      message: "Comment added",
      commentsCount: post.comments.length,
      comments: post.comments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// SHARE POST
exports.sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    if (!post.shares.includes(userId)) {
      post.shares.push(userId);
      await post.save();
    }

    res.json({
      message: "Post shared",
      sharesCount: post.shares.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// VOTE IN POLL
exports.votePoll = async (req, res) => {
  try {
    const { optionId } = req.body;
    const userId = req.user.id;

    if (!optionId) {
      return res.status(400).json({ message: "Option ID required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post || !post.poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Check if user already voted
    const alreadyVoted = post.poll.options.some((opt) =>
      opt.votes.includes(userId)
    );

    if (alreadyVoted) {
      return res.status(400).json({ message: "User already voted" });
    }

    const option = post.poll.options.id(optionId);
    if (!option) {
      return res.status(404).json({ message: "Option not found" });
    }

    option.votes.push(userId);
    await post.save();

    res.json({
      message: "Vote submitted",
      poll: post.poll
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId?.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
