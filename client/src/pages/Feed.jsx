import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchFeed, createFeedPost } from "../api";
import { Camera, Heart, MessageSquare, Share2, Plus, X } from "lucide-react";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ content: "", image: "" });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const { data } = await fetchFeed();
      setPosts(data);
    } catch (error) {
      console.error("Error loading feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.content) return;
    
    try {
      await createFeedPost({
        ...newPost,
        userName: user.name,
        userAvatar: user.avatar,
        likes: 0
      });
      setNewPost({ content: "", image: "" });
      setShowCreate(false);
      loadFeed();
    } catch (error) {
      alert("Failed to post");
    }
  };

  return (
    <div className="container" style={{ padding: "40px 20px", maxWidth: "700px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "5px" }}>Freelance Hub</h1>
          <p style={{ color: "var(--text-muted)" }}>See what our experts are building right now</p>
        </div>
        {user && (
          <button 
            className="btn-primary" 
            style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "30px", padding: "10px 20px" }}
            onClick={() => setShowCreate(true)}
          >
            <Plus size={20} /> Create Post
          </button>
        )}
      </div>

      {/* Stories Section Removed */}

      <AnimatePresence>
        {showCreate && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="card" 
            style={{ marginBottom: "30px", border: "2px solid var(--primary)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <h3 style={{ fontSize: "1.1rem" }}>New Update</h3>
              <X size={20} style={{ cursor: "pointer" }} onClick={() => setShowCreate(false)} />
            </div>
            <textarea 
              placeholder="What's happening in your workspace?" 
              style={{ width: "100%", border: "none", padding: "0", fontSize: "1rem", outline: "none", minHeight: "80px", resize: "none" }}
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "15px", marginTop: "10px" }}>
              <div style={{ display: "flex", gap: "15px" }}>
                <Camera size={20} style={{ color: "var(--primary)", cursor: "pointer" }} />
              </div>
              <button className="btn-primary" onClick={handleCreatePost}>Post Status</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {loading ? (
          <p>Loading the hub...</p>
        ) : (
          posts.map((post, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              key={post._id} 
              className="card" 
              style={{ padding: "0", overflow: "hidden" }}
            >
              <div style={{ padding: "15px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700" }}>{post.userName}</h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{new Date(post.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ padding: "0 15px 15px 15px" }}>
                <p style={{ fontSize: "1rem", lineHeight: "1.5", color: "var(--text)" }}>{post.content}</p>
              </div>
              {post.image && (
                <img src={post.image} alt="Post" style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }} />
              )}
              <div style={{ padding: "12px 15px", borderTop: "1px solid var(--border)", display: "flex", gap: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "var(--text-muted)" }}>
                  <Heart size={20} /> <span style={{ fontSize: "0.9rem" }}>{post.likes || 0}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "var(--text-muted)" }}>
                  <MessageSquare size={20} /> <span style={{ fontSize: "0.9rem" }}>Reply</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "var(--text-muted)" }}>
                  <Share2 size={20} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default Feed;
