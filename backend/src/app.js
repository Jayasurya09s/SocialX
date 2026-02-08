const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("🚀 SocialX Backend Running");
});

module.exports = app;
