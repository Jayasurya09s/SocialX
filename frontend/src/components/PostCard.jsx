import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  TextField,
  Button,
  Avatar,
  Box,
  Divider
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { useContext, useState } from "react";
import API from "../api/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AuthContext } from "../context/AuthContext";

dayjs.extend(relativeTime);

const PostCard = ({ post }) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { user } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnPost = user?.id === post.userId;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likesCount || 0);
  const [shareCount, setShareCount] = useState(post.sharesCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentsCount || 0);
  const [localComments, setLocalComments] = useState(post.comments || []);
  const hasVoted = post.poll?.options?.some((opt) =>
    opt.votes?.includes(user?.id)
  );

  const likePost = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(prev - 1, 0)));
    await API.post(`/posts/${post._id}/like`);
  };

  const sharePost = async () => {
    setShareCount((prev) => prev + 1);
    await API.post(`/posts/${post._id}/share`);

    const shareUrl = `${window.location.origin}/post/${post._id}`;
    await navigator.clipboard.writeText(shareUrl);

    alert("Post link copied to clipboard!");
  };


  const addComment = async () => {
    if (!comment.trim()) return;
    await API.post(`/posts/${post._id}/comment`, { text: comment });
    const newComment = {
      username: user?.username || "you",
      text: comment,
      createdAt: new Date().toISOString()
    };
    setLocalComments((prev) => [newComment, ...prev]);
    setCommentCount((prev) => prev + 1);
    setComment("");
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-soft)",
        background: "var(--color-card)"
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 44, height: 44 }}>
            {(post.username || "U").slice(0, 2).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography fontWeight={700}>{post.username || "User"}</Typography>
              <Typography variant="body2" color="text.secondary">
                @{post.username || "user"}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {dayjs(post.createdAt).format("ddd MMM DD YYYY · h:mm A")}
            </Typography>
          </Box>
          {!isOwnPost && (
            <Button
              size="small"
              variant={isFollowing ? "contained" : "outlined"}
              onClick={async () => {
                try {
                  const res = await API.post(`/users/${post.userId}/follow`);
                  setIsFollowing(Boolean(res.data.following));
                } catch (error) {
                  alert(error.response?.data?.message || "Unable to follow");
                }
              }}
              sx={{ borderRadius: "999px", textTransform: "none" }}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </Stack>

        {post.text && (
          <Typography mt={2} sx={{ whiteSpace: "pre-line" }}>
            {post.text}
          </Typography>
        )}

        {post.imageUrl && (
          <Box sx={{ mt: 2 }}>
            <img
              src={post.imageUrl}
              alt="Post"
              style={{ width: "100%", borderRadius: 12 }}
            />
          </Box>
        )}

        {post.poll?.question && (
          <Stack spacing={1} mt={2}>
            <Typography fontWeight={700}>{post.poll.question}</Typography>

            {post.poll.options.map((opt) => (
              <Button
                key={opt._id}
                variant="outlined"
                disabled={hasVoted}
                onClick={async () => {
                  const optionId = opt._id || opt.id;
                  if (!optionId) return;

                  try {
                    await API.post(`/posts/${post._id}/vote`, {
                      optionId
                    });
                  } catch (error) {
                    const message =
                      error.response?.data?.message || "Unable to submit vote";
                    alert(message);
                  }
                }}
                sx={{ justifyContent: "space-between" }}
              >
                {opt.text}
                <Typography variant="caption" color="text.secondary">
                  {opt.votes.length}
                </Typography>
              </Button>
            ))}
          </Stack>
        )}

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={likePost}>
            {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {likeCount}
            </Typography>
          </IconButton>

          <IconButton onClick={() => setShowComments(!showComments)}>
            <ChatBubbleOutlineIcon />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {commentCount}
            </Typography>
          </IconButton>

          <IconButton onClick={sharePost}>
            <ShareOutlinedIcon />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {shareCount}
            </Typography>
          </IconButton>
        </Stack>

        {showComments && (
          <>
            <Stack spacing={1} mt={2}>
              {localComments.map((c, i) => (
                <Box key={i} sx={{ background: "#f5f7fb", p: 1.5, borderRadius: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={600}>
                      @{c.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.createdAt
                        ? dayjs(c.createdAt).format("MMM D, h:mm A")
                        : "Just now"}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.primary">
                    {c.text}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Stack direction="row" spacing={1} mt={2}>
              <TextField
                size="small"
                placeholder="Write a comment..."
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                variant="outlined"
              />
              <Button variant="contained" onClick={addComment}>
                Send
              </Button>
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
