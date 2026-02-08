import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  IconButton,
  Box,
  Typography,
  Popover
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import { useState } from "react";
import API from "../api/axios";

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [showPoll, setShowPoll] = useState(false);
  const [imageFileName, setImageFileName] = useState("");

  const handlePost = async () => {
    if (!text && !imageUrl && !pollQuestion) return;
    setIsPosting(true);

    const payload = {
      text,
      imageUrl
    };

    if (showPoll && pollQuestion) {
      payload.poll = {
        question: pollQuestion,
        options: pollOptions
          .filter((opt) => opt.trim())
          .map((opt) => ({ text: opt }))
      };
    }

    try {
      await API.post("/posts", payload);

      // reset
      setText("");
      setImageUrl("");
      setPollQuestion("");
      setPollOptions(["", ""]);
      setShowPoll(false);
      setImageFileName("");

      onPostCreated();
    } finally {
      setIsPosting(false);
    }
  };

  const updateOption = (i, value) => {
    const updated = [...pollOptions];
    updated[i] = value;
    setPollOptions(updated);
  };

  const isPostDisabled = !text.trim() && !imageUrl && !pollQuestion;
  const emojiOpen = Boolean(emojiAnchor);

  return (
    <Card
      sx={{
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-soft)",
        background: "var(--color-card)"
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography fontWeight={700}>Create Post</Typography>
        </Stack>

        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={{ mt: 2, background: "rgba(31, 35, 48, 0.04)", px: 2, py: 1.5, borderRadius: 2 }}
        />

        {imageUrl && (
          <Box sx={{ mt: 2 }}>
            <img
              src={imageUrl}
              alt="Selected"
              style={{ borderRadius: 12 }}
            />
            {imageFileName && (
              <Typography variant="caption" color="text.secondary">
                {imageFileName}
              </Typography>
            )}
          </Box>
        )}

        <Stack direction="row" spacing={1.5} mt={2} alignItems="center">
          <IconButton
            component="label"
            sx={{ background: "rgba(47, 107, 255, 0.08)" }}
          >
            <ImageOutlinedIcon />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setImageUrl(String(reader.result));
                  setImageFileName(file.name);
                };
                reader.readAsDataURL(file);
              }}
            />
          </IconButton>
          <IconButton
            onClick={(e) => setEmojiAnchor(e.currentTarget)}
            sx={{ background: "rgba(47, 107, 255, 0.08)" }}
          >
            <EmojiEmotionsOutlinedIcon />
          </IconButton>
          <IconButton
            onClick={() => setShowPoll(!showPoll)}
            sx={{ background: "rgba(47, 107, 255, 0.08)" }}
          >
            <PollOutlinedIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            disabled={isPostDisabled || isPosting}
            onClick={handlePost}
            sx={{ borderRadius: "999px", px: 3 }}
          >
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </Stack>


        <Popover
          open={emojiOpen}
          anchorEl={emojiAnchor}
          onClose={() => setEmojiAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Stack direction="row" spacing={1} sx={{ p: 1.5 }}>
            {["😀", "🔥", "✨", "💡", "🚀", "❤️"].map((item) => (
              <Button
                key={item}
                onClick={() => {
                  setText((prev) => `${prev}${item}`);
                  setEmojiAnchor(null);
                }}
              >
                {item}
              </Button>
            ))}
          </Stack>
        </Popover>

        {showPoll && (
          <Stack spacing={1} mt={2}>
            <TextField
              placeholder="Poll question"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              fullWidth
            />

            {pollOptions.map((opt, i) => (
              <TextField
                key={i}
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
              />
            ))}

            <Button size="small" onClick={() => setPollOptions([...pollOptions, ""])}>
              + Add option
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePost;
