const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  getMe,
  getMyPosts,
  toggleFollow
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.get("/me/posts", authMiddleware, getMyPosts);
router.post("/:id/follow", authMiddleware, toggleFollow);

module.exports = router;
