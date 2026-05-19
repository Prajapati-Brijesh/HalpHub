import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ShieldCheck, MapPin, Zap } from "lucide-react";
import { toggleFavorite } from "../api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function ServiceCard({ service }) {
  const { _id, name, price, location, image, description, category } = service;
  const user = JSON.parse(localStorage.getItem('user'));
  const [isFav, setIsFav] = useState(user?.favorites?.includes(_id));

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to save favorites");
    try {
      const { data } = await toggleFavorite(_id);
      setIsFav(!isFav);
      const updatedUser = { ...user, favorites: data.favorites };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success(data.message);
    } catch (err) {
      toast.error("Failed to update favorites");
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="card" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "0", 
        height: "100%", 
        position: "relative",
        padding: "0",
        overflow: "hidden",
        borderRadius: "24px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
      }}
    >
      {/* Badges */}
      <div style={{ position: "absolute", top: "15px", left: "15px", zIndex: 10, display: "flex", gap: "8px" }}>
        <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(5px)", padding: "4px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.7rem", fontWeight: "800", color: "#d97706", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <Zap size={12} fill="#d97706" /> ELITE
        </div>
        <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(5px)", padding: "4px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.7rem", fontWeight: "800", color: "var(--primary)", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <ShieldCheck size={12} fill="var(--primary)" /> AI VERIFIED
        </div>
      </div>

      <button 
        onClick={handleFavorite}
        style={{ position: "absolute", top: "15px", right: "15px", background: "white", border: "none", borderRadius: "50%", padding: "8px", display: "flex", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", cursor: "pointer", zIndex: 10 }}
      >
        <Heart size={18} fill={isFav ? "#ef4444" : "none"} color={isFav ? "#ef4444" : "#64748b"} />
      </button>

      {image && (
        <div style={{ height: "200px", overflow: "hidden" }}>
            <img 
              src={image} 
              alt={name} 
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "0.5s" }}
              className="service-img"
            />
        </div>
      )}

      <div style={{ padding: "25px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
            {[1,2,3,4,5].map(s => <Star key={s} size={14} color="#f59e0b" fill="#f59e0b" />)}
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "5px", fontWeight: "700" }}>(4.9)</span>
        </div>
        
        <h3 style={{ marginBottom: "10px", fontSize: "1.3rem", fontWeight: "800", color: "#1e293b" }}>{name}</h3>
        <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "20px", lineHeight: "1.6", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{description}</p>
        
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8", display: "block", fontWeight: "700" }}>Starting from</span>
            <span style={{ fontWeight: "900", color: "#1e293b", fontSize: "1.5rem" }}>₹{price}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>
            <MapPin size={14} color="var(--primary)" /> {location}
          </div>
        </div>

        <Link to={`/service/${_id}`} style={{ 
            textAlign: "center", 
            textDecoration: "none", 
            background: "#1e293b", 
            color: "white", 
            padding: "15px", 
            borderRadius: "15px", 
            fontWeight: "800",
            fontSize: "0.95rem",
            transition: "0.3s"
        }} onMouseEnter={e => e.currentTarget.style.background = "#0f172a"}>
          View Professional Details
        </Link>
      </div>
    </motion.div>
  );
}

export default ServiceCard;
