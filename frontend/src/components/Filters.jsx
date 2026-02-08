import { Box, Button, Stack } from "@mui/material";

const Filters = ({ filter, setFilter }) => {
  const filters = [
    { label: "All Posts", value: "all" },
    { label: "For You", value: "forYou" },
    { label: "Most Liked", value: "mostLiked" },
    { label: "Most Commented", value: "mostCommented" },
    { label: "Most Shared", value: "mostShared" }
  ];

  return (
    <Box
      sx={{
        background: "var(--color-card)",
        borderRadius: "999px",
        px: 1,
        py: 1,
        boxShadow: "var(--shadow-soft)",
        overflowX: "auto"
      }}
    >
      <Stack direction="row" spacing={1} sx={{ minWidth: "max-content" }}>
        {filters.map((item) => (
          <Button
            key={item.value}
            onClick={() => setFilter(item.value)}
            variant={filter === item.value ? "contained" : "outlined"}
            disableElevation
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              backgroundColor: filter === item.value ? "#dbe8ff" : "#fff",
              color: filter === item.value ? "#0f1e3a" : "#1f2330",
              borderColor: filter === item.value ? "var(--color-primary)" : "#e2e6f0",
              boxShadow: filter === item.value
                ? "0 0 0 2px rgba(47, 107, 255, 0.25), 0 10px 18px rgba(47, 107, 255, 0.18)"
                : "none",
              whiteSpace: "nowrap",
              "&:hover": {
                background: filter === item.value ? "#cfe0ff" : "#f3f5fb"
              }
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default Filters;
