import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Zap, Shield, Phone, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

function EmergencyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, requesting, confirmed

  const handleEmergency = (type) => {
    setIsRequesting(true);
    setStatus("requesting");
    
    // Simulate finding nearest provider
    setTimeout(() => {
        setIsRequesting(false);
        setStatus("confirmed");
        toast.success(`Emergency ${type} Request Confirmed! Expert is 5 mins away.`);
    }, 3000);
  };

  return (
    <>
      {/* Floating Pulse Button */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{
          position: "fixed",
          bottom: "30px",
          left: "30px",
          zIndex: 1000
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#ef4444",
            color: "white",
            border: "none",
            boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <AlertCircle size={30} />
        </button>
      </motion.div>

      {/* Emergency Modal */}
      <AnimatePresence>
        {isOpen && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                width: "100%",
                maxWidth: "450px",
                background: "white",
                borderRadius: "30px",
                padding: "40px",
                textAlign: "center",
                boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
              }}
            >
              {status === "idle" && (
                <>
                  <div style={{ color: "#ef4444", marginBottom: "20px" }}><AlertCircle size={60} style={{ margin: "0 auto" }} /></div>
                  <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "10px" }}>Emergency Help</h2>
                  <p style={{ color: "#64748b", marginBottom: "30px" }}>One-tap assistance for urgent services. We'll dispatch the nearest verified expert immediately.</p>
                  
                  <div style={{ display: "grid", gap: "15px" }}>
                    <button onClick={() => handleEmergency("Electrical")} style={{ background: "#fef2f2", color: "#ef4444", padding: "20px", borderRadius: "15px", border: "1px solid #fee2e2", display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: "700" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}><Zap size={24} /> Electrical Spark/Short</div>
                        <Phone size={18} />
                    </button>
                    <button onClick={() => handleEmergency("Plumbing")} style={{ background: "#fef2f2", color: "#ef4444", padding: "20px", borderRadius: "15px", border: "1px solid #fee2e2", display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: "700" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}><Shield size={24} /> Water Leak/Pipe Burst</div>
                        <Phone size={18} />
                    </button>
                  </div>
                  
                  <button onClick={() => setIsOpen(false)} style={{ marginTop: "20px", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontWeight: "600" }}>Close</button>
                </>
              )}

              {status === "requesting" && (
                <div style={{ padding: "40px 0" }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Loader2 size={60} color="#ef4444" style={{ margin: "0 auto 20px" }} />
                  </motion.div>
                  <h3 style={{ fontSize: "1.5rem" }}>Dispatching Expert...</h3>
                  <p style={{ color: "#64748b" }}>Contacting 3 professionals within 2km of your location.</p>
                </div>
              )}

              {status === "confirmed" && (
                <div style={{ padding: "40px 0" }}>
                  <div style={{ color: "#10b981", marginBottom: "20px" }}><CheckCircle size={60} style={{ margin: "0 auto" }} /></div>
                  <h3 style={{ fontSize: "1.5rem" }}>Help is Coming!</h3>
                  <p style={{ color: "#64748b" }}>Ravi (Expert Electrician) is on the way. <br /><strong>ETA: 4 Mins</strong></p>
                  <button onClick={() => setIsOpen(false)} className="btn-primary" style={{ marginTop: "30px", width: "100%", padding: "15px" }}>Track Live</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default EmergencyButton;
