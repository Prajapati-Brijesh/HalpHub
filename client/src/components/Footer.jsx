import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "../assets/logo.png";
import { useLanguage } from "../context/LanguageContext";

function Footer() {
  const { lang, toggleLanguage, t } = useLanguage();
  return (
    <footer style={{ 
      background: "var(--card)", 
      borderTop: "1px solid var(--border)",
      padding: "60px 5% 20px 5%",
      marginTop: "60px",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.02)"
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px", marginBottom: "40px" }}>
        
        {/* Brand Section */}
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <img src={logo} alt="HelpHub Logo" style={{ height: "100px", objectFit: "contain" }} />
          </div>
          <p style={{ color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "20px" }}>
            The smartest way to book top-rated home services. Reliable, fast, and secure.
          </p>
          <div style={{ display: "flex", background: "rgba(0,0,0,0.05)", borderRadius: "20px", padding: "4px", width: "fit-content" }}>
            <button 
              onClick={() => toggleLanguage('en')}
              style={{ padding: "4px 12px", borderRadius: "16px", border: "none", fontSize: "0.7rem", fontWeight: "600", cursor: "pointer", background: lang === 'en' ? "var(--primary)" : "transparent", color: lang === 'en' ? "white" : "var(--text-muted)" }}
            >
              English
            </button>
            <button 
              onClick={() => toggleLanguage('hi')}
              style={{ padding: "4px 12px", borderRadius: "16px", border: "none", fontSize: "0.7rem", fontWeight: "600", cursor: "pointer", background: lang === 'hi' ? "var(--primary)" : "transparent", color: lang === 'hi' ? "white" : "var(--text-muted)" }}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 style={{ fontSize: "1.1rem", marginBottom: "20px", color: "var(--text)" }}>Quick Links</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            <li><Link to="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link></li>
            <li><Link to="/services" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Our Services</Link></li>
            <li><Link to="/about" style={{ color: "var(--text-muted)", textDecoration: "none" }}>About Us</Link></li>
            <li><Link to="/contact" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ fontSize: "1.1rem", marginBottom: "20px", color: "var(--text)" }}>Contact Us</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "15px", color: "var(--text-muted)" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><Phone size={18} color="var(--primary)" /> +91 93131 16750</li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><Mail size={18} color="var(--primary)" /> prajabrijesh67@gmail.com</li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><MapPin size={18} color="var(--primary)" /> Kadi, Gujarat, India</li>
          </ul>
        </div>
      </div>

      <div style={{ 
        textAlign: "center", 
        paddingTop: "20px", 
        borderTop: "1px solid var(--border)",
        color: "var(--text-muted)",
        fontSize: "0.9rem"
      }}>
        &copy; {new Date().getFullYear()} HelpHub. All rights reserved. Made with ❤️ in India.
      </div>
    </footer>
  );
}

export default Footer;
