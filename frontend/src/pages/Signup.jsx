import { TextField, Button, Box, Typography, Stack, Card, CardContent } from "@mui/material";
import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleSignup = async () => {
    await API.post("/auth/signup", form);
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3f4f7 0%, #eef2ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 500, borderRadius: 4, boxShadow: "var(--shadow-soft)" }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Create your account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join the SocialX community and start posting today.
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Username"
              margin="normal"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleSignup}
              sx={{ borderRadius: "999px", py: 1.2 }}
            >
              Sign Up
            </Button>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">
                Already have an account? <Link to="/login">Login</Link>
              </Typography>
              <Typography variant="body2">
                <Link to="/about">About SocialX</Link>
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
