import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, Stack, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { AuthContext } from "../context/AuthContext";
import TopBar from "../components/TopBar";
import CreatePost from "../components/CreatePost";
import Filters from "../components/Filters";
import Feed from "../components/Feed";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // 🚨 BLOCK UNAUTHENTICATED USERS
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <TopBar />

      <Box
        sx={{
          maxWidth: "98%",
          width: "98%",
          mx: "auto",
          px: { xs: 1.5, md: 2 },
          py: 3
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            background: "var(--color-card)",
            borderRadius: "999px",
            px: 2,
            py: 1,
            boxShadow: "var(--shadow-soft)"
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search users, posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "var(--color-muted)" }} />
                </InputAdornment>
              )
            }}
            sx={{
              background: "rgba(31, 35, 48, 0.04)",
              px: 2,
              py: 1,
              borderRadius: "999px"
            }}
          />
        </Stack>

        <Box
          sx={{
            mt: 3,
            position: "static"
          }}
        >
          <CreatePost onPostCreated={() => setRefreshKey((k) => k + 1)} />
        </Box>

        <Box
          sx={{
            mt: 2,
            position: "static"
          }}
        >
          <Filters filter={filter} setFilter={setFilter} />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Feed filter={filter} refreshKey={refreshKey} searchQuery={searchQuery} />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
