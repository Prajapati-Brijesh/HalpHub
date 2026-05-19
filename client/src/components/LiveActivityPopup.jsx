import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Users, CheckCircle } from "lucide-react";

const activities = [
  { name: "Rahul", city: "Ahmedabad", service: "Plumber", time: "2 mins ago" },
  { name: "Priya", city: "Satellite", service: "Deep Cleaning", time: "5 mins ago" },
  { name: "Amit", city: "Vastrapur", service: "AC Repair", time: "1 min ago" },
  { name: "Sneha", city: "Bopal", service: "Pest Control", time: "8 mins ago" },
  { name: "Jay", city: "Bodakdev", service: "Electrician", time: "just now" },
];

function LiveActivityPopup() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showInterval = setInterval(() => {
      setIndex(prev => (prev + 1) % activities.length);
      setIsVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    }, 12000); // Show every 12 seconds

    return () => clearInterval(showInterval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          style={{
            position: "fixed",
            bottom: "30px",
            left: "30px",
            zIndex: 9999,
            background: "white",
            padding: "12px 20px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            border: "1px solid var(--border)",
            minWidth: "280px"
          }}
        >
          <div style={{ 
            background: "var(--primary-light)", 
            color: "var(--primary)", 
            width: "40px", 
            height: "40px", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }}>
            <ShoppingBag size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: "600", color: "var(--text)" }}>
              {activities[index].name} <span style={{ fontWeight: "400", color: "var(--text-muted)" }}>from</span> {activities[index].city}
            </p>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--primary)", fontWeight: "700" }}>
              Just booked a {activities[index].service}
            </p>
            <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--text-muted)" }}>
              {activities[index].time}
            </p>
          </div>
          <CheckCircle size={16} style={{ color: "#10b981" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LiveActivityPopup;
