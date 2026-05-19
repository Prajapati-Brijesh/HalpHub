import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../api";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await signIn(formData);
      if (data.user.role !== 'admin') {
        toast.error("Access Denied: Only administrators can enter here.");
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success("Admin access granted");
      navigate('/admin');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#0f172a", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Decorative Elements */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)",
        borderRadius: "50%",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%",
        left: "-5%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(14,165,233,0) 70%)",
        borderRadius: "50%",
        zIndex: 0
      }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          padding: "48px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          zIndex: 1
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", 
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.5)"
          }}>
            <ShieldCheck color="white" size={32} />
          </div>
          <h1 style={{ color: "white", fontSize: "1.875rem", fontWeight: "800", marginBottom: "8px" }}>Admin Portal</h1>
          <p style={{ color: "#94a3b8", fontSize: "1rem" }}>Secure access for marketplace managers</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ position: "relative" }}>
            <label style={{ display: "block", color: "#e2e8f0", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} size={20} />
              <input 
                required
                type="email"
                placeholder="admin@helphub.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  width: "100%",
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "14px 14px 14px 48px",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                onBlur={(e) => e.target.style.borderColor = "#334155"}
              />
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <label style={{ display: "block", color: "#e2e8f0", fontSize: "0.875rem", fontWeight: "600", marginBottom: "8px" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} size={20} />
              <input 
                required
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{
                  width: "100%",
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "14px 14px 14px 48px",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                onBlur={(e) => e.target.style.borderColor = "#334155"}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              marginTop: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              color: "white",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
              transition: "transform 0.2s, boxShadow 0.2s"
            }}
            onMouseEnter={(e) => { if(!loading) e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={(e) => { if(!loading) e.currentTarget.style.transform = "translateY(0)" }}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Sign In to Dashboard <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            Authorized Personnel Only
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
