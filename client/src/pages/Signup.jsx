import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../api";

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await signUp(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "450px", padding: "80px 20px" }}>
      <div className="card">
        <h2 style={{ marginBottom: "24px", textAlign: "center" }}>Create Account</h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", gap: "10px", background: "#f1f5f9", padding: "4px", borderRadius: "12px", marginBottom: "10px" }}>
            <button 
              type="button"
              onClick={() => setFormData({...formData, role: 'user'})}
              style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer", background: formData.role === 'user' ? "white" : "transparent", boxShadow: formData.role === 'user' ? "0 2px 4px rgba(0,0,0,0.05)" : "none", fontWeight: formData.role === 'user' ? "600" : "400" }}
            >
              I am a Customer
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, role: 'provider'})}
              style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer", background: formData.role === 'provider' ? "white" : "transparent", boxShadow: formData.role === 'provider' ? "0 2px 4px rgba(0,0,0,0.05)" : "none", fontWeight: formData.role === 'provider' ? "600" : "400" }}
            >
              I am a Provider
            </button>
          </div>

          <input 
            required
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            required
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            required
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: "14px" }}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "0.95rem" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--primary)", fontWeight: "600" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
