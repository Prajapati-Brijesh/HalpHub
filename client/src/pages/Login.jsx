import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../api";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await signIn(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
      window.location.reload(); // To update Navbar state
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "450px", padding: "80px 20px" }}>
      <div className="card">
        <h2 style={{ marginBottom: "24px", textAlign: "center" }}>Login to HelpHub</h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "0.95rem" }}>
          Don't have an account? <Link to="/signup" style={{ color: "var(--primary)", fontWeight: "600" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
