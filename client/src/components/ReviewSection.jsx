import React, { useState, useEffect } from "react";
import { Star, Send, User, Brain, ThumbsUp, AlertCircle } from "lucide-react";
import { fetchReviews, createReview, fetchReviewSummary } from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function ReviewSection({ serviceId }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadData();
  }, [serviceId]);

  const loadData = async () => {
    try {
      const [revRes, sumRes] = await Promise.all([
        fetchReviews(serviceId),
        fetchReviewSummary(serviceId)
      ]);
      setReviews(revRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to leave a review");
    setLoading(true);
    try {
      await createReview({
        ...newReview,
        service_id: serviceId,
        user_name: user.name,
        created_at: new Date().toISOString()
      });
      toast.success("Review added!");
      setNewReview({ rating: 5, comment: "" });
      loadData();
    } catch (err) {
      toast.error("Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "60px", borderTop: "1px solid var(--border)", paddingTop: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ margin: 0 }}>Customer Reviews</h2>
        {summary?.stats?.total > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f0fdf4", padding: "6px 14px", borderRadius: "20px", border: "1px solid #bbf7d0", color: "#166534", fontSize: "0.85rem", fontWeight: "700" }}>
            <ThumbsUp size={16} /> {summary.stats.positive_percent}% Positive Feedback
          </div>
        )}
      </div>

      {/* AI Summary Box */}
      {summary && summary.stats.total > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", 
            padding: "24px", 
            borderRadius: "16px", 
            marginBottom: "40px",
            border: "1px solid var(--border)",
            display: "flex",
            gap: "20px",
            alignItems: "center"
          }}
        >
          <div style={{ background: "var(--primary)", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
            <Brain size={28} />
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--primary)", letterSpacing: "1px", textTransform: "uppercase" }}>AI Insights</span>
            <p style={{ margin: "5px 0 0 0", fontSize: "1rem", color: "#334155", fontStyle: "italic", lineHeight: "1.5" }}>
              "{summary.summary}"
            </p>
          </div>
        </motion.div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "60px" }}>
        
        {/* Review Form */}
        <div>
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            <h3 style={{ marginBottom: "20px" }}>Write a Review</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "10px", fontSize: "0.9rem", color: "var(--text-muted)" }}>Rating</label>
                <div style={{ display: "flex", gap: "5px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      size={24}
                      fill={star <= newReview.rating ? "#f59e0b" : "none"}
                      color={star <= newReview.rating ? "#f59e0b" : "#cbd5e1"}
                      style={{ cursor: "pointer" }}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "10px", fontSize: "0.9rem", color: "var(--text-muted)" }}>Your Comment</label>
                <textarea 
                  required
                  rows="4"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience..."
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", outline: "none" }}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <Send size={18} /> Submit Review
              </button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {reviews.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((rev, i) => (
              <div key={i} className="card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>
                      {rev.user_name?.[0] || <User size={16} />}
                    </div>
                    <div>
                        <span style={{ fontWeight: "600", display: "block" }}>{rev.user_name}</span>
                        {rev.sentiment && rev.sentiment !== 'neutral' && (
                            <span style={{ 
                                fontSize: "0.65rem", 
                                background: rev.sentiment === 'positive' ? "#dcfce7" : "#fee2e2", 
                                color: rev.sentiment === 'positive' ? "#166534" : "#991b1b",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontWeight: "800",
                                textTransform: "uppercase"
                            }}>
                                {rev.sentiment === 'positive' ? 'Highly Satisfied' : 'Critical Feedback'}
                            </span>
                        )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill={star <= rev.rating ? "#f59e0b" : "none"} color={star <= rev.rating ? "#f59e0b" : "#cbd5e1"} />
                    ))}
                  </div>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.5", margin: "10px 0" }}>{rev.comment}</p>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default ReviewSection;
