const express = require("express");
const {
  createPost,
  getFeed,
  toggleLike,
  addComment,
  sharePost,
  votePoll,
  deletePost
} = require("../controllers/post.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getFeed);

router.post("/:id/like", authMiddleware, toggleLike);
router.post("/:id/comment", authMiddleware, addComment);
router.post("/:id/share", authMiddleware, sharePost);
router.post("/:id/vote", authMiddleware, votePoll);
router.delete("/:id", authMiddleware, deletePost);
module.exports = router;
