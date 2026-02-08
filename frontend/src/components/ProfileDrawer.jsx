import { useContext, useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Stack,
  Typography,
  Avatar,
  Divider,
  Button,
  IconButton,
  CircularProgress,
  Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const ProfileDrawer = ({ open, onClose }) => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const [profileRes, postsRes] = await Promise.all([
          API.get("/users/me"),
          API.get("/users/me/posts")
        ]);

        setProfile(profileRes.data);
        setPosts(postsRes.data.posts || []);
      } catch (err) {
        setProfile(null);
        setPosts([]);
        setError(err.response?.data?.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [open]);

  const handleDelete = async (postId) => {
    await API.delete(`/posts/${postId}`);
    setPosts((prev) => prev.filter((post) => post._id !== postId));
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          postsCount: Math.max((prev.stats?.postsCount || 1) - 1, 0)
        }
      };
    });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 320, md: 380 }, p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography fontWeight={700}>Profile</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {loading && (
          <Stack alignItems="center" py={4}>
            <CircularProgress size={28} />
          </Stack>
        )}

        {!loading && (
          <>
            {error && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 54, height: 54 }}>
                {(user?.username || "U").slice(0, 2).toUpperCase()}
              </Avatar>
              <Box>
                <Typography fontWeight={700}>{user?.username || "User"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} mt={2}>
              <Box>
                <Typography fontWeight={700}>{profile?.stats?.postsCount || 0}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Posts
                </Typography>
              </Box>
              <Box>
                <Typography fontWeight={700}>{profile?.user?.followersCount || 0}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Followers
                </Typography>
              </Box>
              <Box>
                <Typography fontWeight={700}>{profile?.user?.followingCount || 0}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Following
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} mt={2}>
              <Box>
                <Typography fontWeight={700}>{profile?.stats?.likesCount || 0}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Likes
                </Typography>
              </Box>
              <Box>
                <Typography fontWeight={700}>{profile?.stats?.commentsCount || 0}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Comments
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Followers
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(profile?.user?.followers || []).map((follower) => (
                <Chip
                  key={follower.id}
                  label={`@${follower.username}`}
                  sx={{ mb: 1 }}
                />
              ))}
              {!profile?.user?.followers?.length && (
                <Typography variant="body2" color="text.secondary">
                  No followers yet.
                </Typography>
              )}
            </Stack>

            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Your posts
            </Typography>

            <Stack spacing={2}>
              {posts.map((post) => (
                <Box
                  key={post._id}
                  sx={{
                    background: "#f7f8fb",
                    borderRadius: 2,
                    p: 2
                  }}
                >
                  {post.text && (
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {post.text}
                    </Typography>
                  )}
                  {post.imageUrl && (
                    <Box sx={{ mt: 1 }}>
                      <img
                        src={post.imageUrl}
                        alt="Post"
                        style={{ width: "100%", borderRadius: 10 }}
                      />
                    </Box>
                  )}
                  <Stack direction="row" spacing={2} mt={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Likes: {post.likesCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Comments: {post.commentsCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Shares: {post.sharesCount}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Box>
              ))}

              {!posts.length && (
                <Typography variant="body2" color="text.secondary">
                  No posts yet.
                </Typography>
              )}
            </Stack>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default ProfileDrawer;
