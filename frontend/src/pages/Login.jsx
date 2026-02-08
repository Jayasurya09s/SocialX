import { TextField, Button, Box, Typography, Stack, Card, CardContent, Alert } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    }
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
      <Card sx={{ width: "100%", maxWidth: 460, borderRadius: 4, boxShadow: "var(--shadow-soft)" }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Log in to continue to SocialX.
              </Typography>
            </Box>

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

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{ borderRadius: "999px", py: 1.2 }}
            >
              Login
            </Button>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">
                New here? <Link to="/signup">Create an account</Link>
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

export default Login;
