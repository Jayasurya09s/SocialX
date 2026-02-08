const User = require("../models/User.model");
const Post = require("../models/Post.model");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("followers", "username")
      .populate("following", "username")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ userId: req.user.id }).lean();

    const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
    const totalComments = posts.reduce(
      (sum, post) => sum + (post.comments?.length || 0),
      0
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
        followers: (user.followers || []).map((follower) => ({
          id: follower._id,
          username: follower.username
        })),
        following: (user.following || []).map((followed) => ({
          id: followed._id,
          username: followed.username
        }))
      },
      stats: {
        postsCount: posts.length,
        likesCount: totalLikes,
        commentsCount: totalComments
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const formattedPosts = posts.map((post) => ({
      ...post,
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
      sharesCount: post.shares?.length || 0
    }));

    res.json({ posts: formattedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    if (targetUserId === req.user.id) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === targetUserId.toString()
    );

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== req.user.id.toString()
      );
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(req.user.id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      following: !isFollowing,
      followersCount: targetUser.followers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
