import { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Button } from "@mui/material";
import ProfileDrawer from "./ProfileDrawer";
import { AuthContext } from "../context/AuthContext";

const TopBar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          background: "#ffffff",
          borderBottom: "1px solid rgba(22, 26, 38, 0.08)"
        }}
      >
        <Toolbar sx={{ maxWidth: "98%", width: "98%", mx: "auto",  }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src="/SocialX logo.png"
              alt="SocialX logo"
              sx={{ width: 28, height: 28, borderRadius: "50%" }}
            />
            <Typography variant="h5" fontWeight={700} sx={{ color: "#000" }}>
              SocialX
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="outlined"
            onClick={logout}
            sx={{ mr: 1, borderRadius: "999px", textTransform: "none" }}
          >
            Logout
          </Button>
          <IconButton onClick={() => setProfileOpen(true)}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#2f6bff",
                color: "#fff",
                fontWeight: 700
              }}
            >
              {(user?.username || "ME").slice(0, 2).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

export default TopBar;
