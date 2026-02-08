import { useCallback, useEffect, useState } from "react";
import API from "../api/axios";
import PostCard from "./PostCard";

const Feed = ({ filter, refreshKey, searchQuery }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(
        `/posts?filter=${filter}&page=1&limit=20`
      );
      setPosts(res.data.posts);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [filter]);

  // 🔁 fetch on filter change or new post
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, refreshKey]);

  // ⏱️ auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchPosts, 30000);
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
    </>
  );
};

export default Feed;
