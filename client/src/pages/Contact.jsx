import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import MapView from "../components/MapView";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "15px" }}
        >
          Get In <span className="text-gradient">Touch</span>
        </motion.h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Have a question? We're here to help you 24/7.</p>
      </div>

      <div className="responsive-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "50px", marginBottom: "80px" }}>
        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <div className="card" style={{ display: "flex", gap: "20px", alignItems: "flex-start", padding: "25px" }}>
              <div style={{ background: "var(--primary-light)", padding: "12px", borderRadius: "12px", color: "var(--primary)" }}>
                <Mail size={24} />
              </div>
              <div>
                <h3 style={{ marginBottom: "5px" }}>Email Us</h3>
                <p style={{ color: "var(--text-muted)" }}>prajabrijesh67@gmail.com</p>
              </div>
            </div>

            <div className="card" style={{ display: "flex", gap: "20px", alignItems: "flex-start", padding: "25px" }}>
              <div style={{ background: "var(--primary-light)", padding: "12px", borderRadius: "12px", color: "var(--primary)" }}>
                <Phone size={24} />
              </div>
              <div>
                <h3 style={{ marginBottom: "5px" }}>Call Us</h3>
                <p style={{ color: "var(--text-muted)" }}>+91 93131 16750</p>
              </div>
            </div>

            <div className="card" style={{ display: "flex", gap: "20px", alignItems: "flex-start", padding: "25px" }}>
              <div style={{ background: "var(--primary-light)", padding: "12px", borderRadius: "12px", color: "var(--primary)" }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ marginBottom: "5px" }}>Visit Us</h3>
                <p style={{ color: "var(--text-muted)" }}>Kadi</p>
                <p style={{ color: "var(--text-muted)" }}>Gujarat, India</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }}
          className="card" 
          style={{ padding: "40px" }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="responsive-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Your Name" 
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", background: "#f8fafc" }} 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Email</label>
                <input 
                  required
                  type="email" 
                  placeholder="Your Email" 
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", background: "#f8fafc" }} 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Subject</label>
              <input 
                required
                type="text" 
                placeholder="How can we help?" 
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", background: "#f8fafc" }} 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Message</label>
              <textarea 
                required
                placeholder="Write your message here..." 
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", background: "#f8fafc", minHeight: "150px", resize: "none" }} 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
            <button className="btn-primary" type="submit" style={{ padding: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "1.1rem" }}>
              {submitted ? "Message Sent!" : <><Send size={20} /> Send Message</>}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Map Section */}
      <div style={{ marginBottom: "60px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "30px", textAlign: "center" }}>Our Location</h2>
        <MapView services={[{ _id: 'main', name: 'HalpHub HQ', lat: 23.0225, lng: 72.5714, price: 'Main Office', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }]} />
      </div>
    </div>
  );
}

export default Contact;
