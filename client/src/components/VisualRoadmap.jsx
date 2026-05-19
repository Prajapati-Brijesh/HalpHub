import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const VisualRoadmap = ({ milestones }) => {
  if (!milestones) return null;

  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", marginBottom: "40px" }}>
        {/* Progress Line Background */}
        <div 
          style={{ 
            position: "absolute", 
            top: "15px", 
            left: "20px", 
            right: "20px", 
            height: "2px", 
            background: "#e2e8f0", 
            zIndex: 0 
          }} 
        />
        
        {/* Active Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ 
            width: `${(milestones.filter(m => m.status === 'completed').length - 1) / (milestones.length - 1) * 100}%` 
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ 
            position: "absolute", 
            top: "15px", 
            left: "20px", 
            height: "2px", 
            background: "var(--primary)", 
            zIndex: 1 
          }} 
        />

        {milestones.map((m, index) => (
          <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, flex: 1 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "50%", 
                background: m.status === 'completed' ? "var(--primary)" : "white",
                border: `2px solid ${m.status === 'completed' ? "var(--primary)" : "#e2e8f0"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: m.status === 'completed' ? "white" : "#94a3b8",
                boxShadow: m.status === 'completed' ? "0 0 15px rgba(99, 102, 241, 0.3)" : "none"
              }}
            >
              {m.status === 'completed' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
            </motion.div>
            <div style={{ marginTop: "12px", textAlign: "center" }}>
              <span style={{ 
                fontSize: "0.75rem", 
                fontWeight: "600", 
                display: "block",
                color: m.status === 'completed' ? "var(--text)" : "#94a3b8"
              }}>
                {m.title}
              </span>
              {m.date && (
                <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{m.date}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualRoadmap;
