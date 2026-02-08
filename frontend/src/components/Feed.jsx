import { useCallback, useEffect, useState } from "react";
import API from "../api/axios";
import PostCard from "./PostCard";
import { Box, Button } from "@mui/material";

const Feed = ({ filter, refreshKey, searchQuery }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNumber = 1, mode = "replace") => {
    try {
      if (mode === "replace") {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const res = await API.get(
        `/posts?filter=${filter}&page=${pageNumber}&limit=20`
      );
      setHasMore(Boolean(res.data.hasMore));
      if (mode === "replace") {
        setPosts(res.data.posts);
      } else {
        setPosts((prev) => [...prev, ...res.data.posts]);
      }
      setLoading(false);
      setLoadingMore(false);
    } catch (err) {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filter]);

  // 🔁 fetch on filter change or new post
  useEffect(() => {
    setPage(1);
    fetchPosts(1, "replace");
  }, [fetchPosts, refreshKey]);

  // ⏱️ auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchPosts(1, "replace"), 30000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  const normalizedQuery = (searchQuery || "").trim().toLowerCase();
  const filteredPosts = normalizedQuery
    ? posts.filter((post) => {
        const haystack = [
          post.text,
          post.username,
          post.handle,
          post.poll?.question
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : posts;

  return (
    <>
      {loading && (
        <p style={{ textAlign: "center", color: "var(--color-muted)" }}>
          Refreshing feed...
        </p>
      )}

      {filteredPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {hasMore && !loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <Button
            variant="outlined"
            disabled={loadingMore}
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchPosts(nextPage, "append");
            }}
            sx={{ borderRadius: "999px", px: 4 }}
          >
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        </Box>
      )}
    </>
  );
};

export default Feed;
