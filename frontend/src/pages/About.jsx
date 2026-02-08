import { Box, Card, CardContent, Stack, Typography, Button, Divider } from "@mui/material";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f6fa 0%, #eef2ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 900, borderRadius: 4, boxShadow: "var(--shadow-soft)" }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h3" fontWeight={700}>
                SocialX: a modern space for real connection
              </Typography>
              <Typography variant="body1" color="text.secondary">
                SocialX is built to feel fast, familiar, and calm while still giving you the tools
                to share what matters. From quick updates to thoughtful posts, you can create a
                feed that reflects your interests and the people you follow. Every screen is
                designed for clarity, quick reading, and smooth interactions on both mobile and
                desktop.
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="h5" fontWeight={700}>
                Why SocialX exists
              </Typography>
              <Typography variant="body1" color="text.secondary">
                SocialX brings structure to the social experience without adding noise. You get a
                clean timeline, flexible filters, and simple actions that make it easy to follow
                conversations. The experience stays light and focused so you can browse quickly or
                dive deeper into the posts that matter.
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={2}>
              <Typography variant="h5" fontWeight={700}>
                Key features
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1" color="text.secondary">
                  - Create rich posts with text, images, and polls.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  - Explore smart filters like Most Liked, Most Commented, and Most Shared.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  - Engage with likes, comments, and shares that update in real time.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  - Follow people to shape a feed that fits your interests.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  - Manage your posts and profile details from one place.
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            <Stack spacing={2}>
              <Typography variant="h5" fontWeight={700}>
                How it works
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Start by creating an account, then publish your first post. You can upload an
                image, add a poll, or keep it simple with text only. Use filters to discover what
                is trending and follow people whose content you enjoy. Your profile shows your
                posts and engagement stats, and you can remove posts at any time.
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={2}>
              <Typography variant="h5" fontWeight={700}>
                The SocialX experience
              </Typography>
              <Typography variant="body1" color="text.secondary">
                The design is intentionally minimal with soft shadows, rounded cards, and subtle
                motion. The feed auto-refreshes to keep counts in sync, and search helps you find
                people or posts instantly. Whether you are here for quick updates or deeper
                conversations, SocialX keeps everything organized and readable.
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} pt={1}>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                sx={{ borderRadius: "999px", px: 4, py: 1.2 }}
              >
                Get started
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ borderRadius: "999px", px: 4, py: 1.2 }}
              >
                Back to login
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default About;
