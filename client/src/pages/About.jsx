import React from "react";
import { motion } from "framer-motion";
import { Users, Target, ShieldCheck, Zap, Heart, Globe } from "lucide-react";

const stats = [
  { icon: <Users className="text-primary" />, label: "Experts", value: "5,000+" },
  { icon: <ShieldCheck className="text-primary" />, label: "Verified Jobs", value: "10,000+" },
  { icon: <Target className="text-primary" />, label: "Customer Satisfaction", value: "99%" },
  { icon: <Zap className="text-primary" />, label: "Fast Response", value: "15 min" },
];

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="responsive-padding" style={{ 
        padding: "100px 20px", 
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", 
        textAlign: "center",
        borderRadius: "0 0 50px 50px",
        marginBottom: "60px"
      }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: "3.5rem", fontWeight: "800", color: "var(--text)", marginBottom: "20px" }}
        >
          Revolutionizing Local <span className="text-gradient">Services</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
          style={{ fontSize: "1.2rem", color: "var(--text-muted)", maxWidth: "800px", margin: "0 auto" }}
        >
          HalpHub is the world's first AI-powered marketplace that connects you with verified local experts in seconds. No more endless searching, just quality results.
        </motion.p>
      </section>

      <div className="container">
        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px", marginBottom: "100px" }}>
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="card" 
              style={{ textAlign: "center", padding: "40px" }}
            >
              <div style={{ marginBottom: "15px", display: "flex", justifyContent: "center" }}>{stat.icon}</div>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "5px" }}>{stat.value}</h2>
              <p style={{ color: "var(--text-muted)", fontWeight: "600" }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Vision & Mission */}
        <div className="responsive-grid-2 responsive-gap-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center", marginBottom: "100px" }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Our Mission</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-muted)" }}>
              At HalpHub, we believe that finding reliable help should be as easy as ordering a pizza. Our mission is to empower local professionals with the tools they need to succeed while providing customers with a seamless, trustworthy experience.
            </p>
            <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Heart size={20} style={{ color: "var(--primary)" }} />
                <span>Putting people first in everything we do</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Globe size={20} style={{ color: "var(--primary)" }} />
                <span>Building communities, one service at a time</span>
              </div>
            </div>
          </motion.div>
          <div style={{ position: "relative" }}>
            <img 
              src="https://images.unsplash.com/photo-1522071823991-b1ae5e6a3048?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Our Team" 
              style={{ width: "100%", borderRadius: "30px", boxShadow: "var(--shadow-xl)" }} 
            />
            <div style={{ position: "absolute", bottom: "-20px", right: "-20px", background: "var(--primary)", color: "white", padding: "20px 40px", borderRadius: "20px", boxShadow: "var(--shadow-lg)" }}>
              <h3 style={{ margin: 0 }}>Est. 2024</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="responsive-padding" style={{ background: "var(--text)", color: "white", padding: "100px 20px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "60px" }}>Why HalpHub?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
            <div className="card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}>
              <h3 style={{ color: "var(--primary)", marginBottom: "15px" }}>AI Matching</h3>
              <p style={{ opacity: 0.8 }}>Our proprietary algorithms find the perfect professional based on your specific requirements and past feedback.</p>
            </div>
            <div className="card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}>
              <h3 style={{ color: "var(--primary)", marginBottom: "15px" }}>Escrow Security</h3>
              <p style={{ opacity: 0.8 }}>Your money is held securely until you are 100% satisfied with the work. No risk, no stress.</p>
            </div>
            <div className="card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}>
              <h3 style={{ color: "var(--primary)", marginBottom: "15px" }}>Verified Pros</h3>
              <p style={{ opacity: 0.8 }}>Every single expert on our platform goes through a rigorous background check and skill verification process.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
