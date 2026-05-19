import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ShieldCheck, Star, Users, MapPin, Zap, Crown, ArrowRight, TrendingUp, 
  Brain, Calculator, CheckCircle, Shield, Play, Globe, Award, Heart 
} from "lucide-react";
import SmartSearch from "../components/SmartSearch";
import MapView from "../components/MapView";
import { useLanguage } from "../context/LanguageContext";
import { fetchServices } from "../api";

function Home() {
  const { t, lang } = useLanguage();
  const [services, setServices] = useState([]);
  const [counts, setCounts] = useState({ users: 2450, bookings: 890, providers: 120 });
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    fetchServices().then(res => setServices(res.data));
    const interval = setInterval(() => {
      setCounts(prev => ({
        ...prev,
        bookings: prev.bookings + Math.floor(Math.random() * 2),
        users: prev.users + Math.floor(Math.random() * 3)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Premium Hero Section */}
      <section style={{ 
        position: "relative",
        padding: "160px 20px 100px", 
        textAlign: "center", 
        background: "radial-gradient(circle at 0% 0%, #f1f5f9 0%, #ffffff 50%, #f8fafc 100%)",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* Animated Background Elements */}
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", top: "-10%", left: "-5%", width: "400px", height: "400px", background: "rgba(99, 102, 241, 0.05)", borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%", zIndex: 0 }}
        />
        
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "white", padding: "10px 25px", borderRadius: "50px", marginBottom: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
              <Zap size={18} color="var(--primary)" fill="var(--primary)" />
              <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "#64748b", letterSpacing: "1px" }}>REVOLUTIONIZING LOCAL SERVICES</span>
            </div>
            
            <h1 className="hero-heading" style={{ fontSize: "5.5rem", marginBottom: "30px", color: "#1e293b", fontWeight: "900", lineHeight: "1.05", letterSpacing: "-2px" }}>
              The Future of <br />
              <span className="text-gradient" style={{ background: "linear-gradient(90deg, #4f46e5, #9333ea, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Hyperlocal Services</span>
            </h1>
            
            <p style={{ fontSize: "1.5rem", color: "#64748b", marginBottom: "50px", maxWidth: "800px", margin: "0 auto 50px", lineHeight: "1.6", fontWeight: "500" }}>
                Book top-tier professionals in seconds. Verified by AI, trusted by thousands, delivered to your doorstep.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "60px" }}>
                <SmartSearch isHero={true} />
            </div>

            <div className="responsive-flex-wrap" style={{ display: "flex", justifyContent: "center", gap: "40px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#64748b", fontSize: "0.9rem", fontWeight: "600" }}>
                    <ShieldCheck size={20} color="#10b981" /> 100% Satisfaction Guaranteed
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#64748b", fontSize: "0.9rem", fontWeight: "600" }}>
                    <Star size={20} color="#f59e0b" fill="#f59e0b" /> 4.9/5 Average Rating
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section (Social Proof for Businesses) */}
      <section style={{ padding: "40px 0", background: "white", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
        <div className="container responsive-gap-mobile" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "80px", opacity: 0.5, flexWrap: "wrap" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#1e293b" }}>TRUSTED BY LEADERS</div>
            {['Google', 'Amazon', 'Zomato', 'UrbanCompany', 'Swiggy'].map((brand, i) => (
                <span key={i} style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "1px" }}>{brand}</span>
            ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section style={{ padding: "120px 20px", background: "white" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <h2 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "20px", color: "#1e293b" }}>Built for Excellence</h2>
            <p style={{ color: "#64748b", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>Why users and businesses prefer HalpHub over traditional platforms.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
            {[
              { icon: <Brain size={40} />, title: "AI Quality Engine", desc: "Every job is verified by our simulated AI vision system for 100% quality assurance.", color: "#6366f1" },
              { icon: <Award size={40} />, title: "Elite Professionals", desc: "Only the top 1% of service providers pass our rigorous multi-step background check.", color: "#f59e0b" },
              { icon: <Globe size={40} />, title: "Hyperlocal Network", desc: "Find help within 30 minutes. Our real-time map keeps you connected to your neighbors.", color: "#10b981" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -15, boxShadow: "0 30px 60px rgba(0,0,0,0.1)" }}
                style={{ 
                    padding: "50px", 
                    textAlign: "left", 
                    background: "#f8fafc", 
                    borderRadius: "32px",
                    transition: "0.3s",
                    border: "1px solid #f1f5f9"
                }}
              >
                <div style={{ 
                    background: "white", 
                    width: "80px", 
                    height: "80px", 
                    borderRadius: "20px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    color: item.color, 
                    marginBottom: "30px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
                }}>{item.icon}</div>
                <h3 style={{ marginBottom: "20px", fontSize: "1.6rem", fontWeight: "800" }}>{item.title}</h3>
                <p style={{ color: "#64748b", fontSize: "1.1rem", lineHeight: "1.8" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Estimator & Live Activity Section (Previously created, polished) */}
      <section className="responsive-padding" style={{ padding: "120px 0", background: "#f1f5f9" }}>
        <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "50px" }}>
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    style={{ padding: "60px", background: "#1e293b", borderRadius: "40px", color: "white", position: "relative", overflow: "hidden" }}
                >
                    <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.05 }}><Calculator size={300} /></div>
                    <div style={{ background: "var(--primary)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px" }}><Brain size={32} /></div>
                    <h2 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "20px" }}>Instant AI Pricing</h2>
                    <p style={{ fontSize: "1.2rem", opacity: 0.8, marginBottom: "40px", lineHeight: "1.7" }}>Stop guessing. Our AI analyzes thousands of data points to give you the most accurate price estimate in real-time.</p>
                    <button onClick={() => window.location.href='/budget-estimator'} className="btn-primary" style={{ padding: "20px 40px", background: "white", color: "#1e293b", fontWeight: "800", fontSize: "1.1rem" }}>Open Estimator</button>
                </motion.div>

                <div className="card" style={{ padding: "50px", borderRadius: "40px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                        <h3 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "900" }}>Platform Pulse</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f0fdf4", color: "#166534", padding: "6px 15px", borderRadius: "30px", fontSize: "0.8rem", fontWeight: "800" }}>
                            <div style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%" }}></div> LIVE UPDATES
                        </div>
                    </div>
                    <div style={{ display: "grid", gap: "25px" }}>
                        {[
                            { user: "Arjun K.", action: "booked Professional Cleaning", time: "Just now", icon: <CheckCircle size={20} color="#10b981" /> },
                            { user: "AI Engine", action: "verified a 5-star AC repair", time: "3 mins ago", icon: <Brain size={20} color="var(--primary)" /> },
                            { user: "Sumit R.", action: "earned ₹250 referral bonus", time: "8 mins ago", icon: <Zap size={20} color="#f59e0b" /> }
                        ].map((activity, i) => (
                            <div key={i} style={{ display: "flex", gap: "20px", alignItems: "start", paddingBottom: "25px", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "15px" }}>{activity.icon}</div>
                                <div>
                                    <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>{activity.user}</div>
                                    <div style={{ color: "#64748b", fontSize: "0.95rem" }}>{activity.action}</div>
                                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "5px" }}>{activity.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Stunning Testimonials */}
      <section style={{ padding: "120px 20px", background: "white" }}>
        <div className="container">
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
                <h2 style={{ fontSize: "3rem", fontWeight: "900", color: "#1e293b" }}>Loved by the Community</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px", maxWidth: "800px", margin: "0 auto" }}>
                {[
                    { name: "Brijesh Prajapati", role: "Creator, Developer & Founder", text: "I have built this entire platform from scratch with passion and dedication. Every single feature, from the backend logic to the responsive user interface, is carefully crafted by me to revolutionize the service booking industry." }
                ].map((t, i) => (
                    <motion.div 
                        key={i} 
                        whileHover={{ y: -10 }}
                        style={{ padding: "40px", background: "#f8fafc", borderRadius: "30px", border: "1px solid #f1f5f9" }}
                    >
                        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                            {[1,2,3,4,5].map(s => <Star key={s} size={16} color="#f59e0b" fill="#f59e0b" />)}
                        </div>
                        <p style={{ fontSize: "1.1rem", color: "#475569", lineHeight: "1.7", fontStyle: "italic", marginBottom: "30px" }}>"{t.text}"</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div>
                                <div style={{ fontWeight: "800", color: "#1e293b" }}>{t.name}</div>
                                <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>{t.role.toUpperCase()}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Provider CTA Section (For Businesses) */}
      <section className="responsive-padding" style={{ padding: "100px 0", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "white" }}>
        <div className="container">
            <div className="responsive-grid-2 responsive-gap-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "100px", alignItems: "center" }}>
                <div>
                    <h2 style={{ fontSize: "3.5rem", fontWeight: "900", marginBottom: "30px", lineHeight: "1.1" }}>Scale Your Business <br />with HalpHub</h2>
                    <p style={{ fontSize: "1.3rem", opacity: 0.8, marginBottom: "50px", lineHeight: "1.6" }}>
                        Join the elite network of service professionals. Get more leads, manage bookings, and grow your revenue effortlessly.
                    </p>
                    <div style={{ display: "grid", gap: "20px", marginBottom: "50px" }}>
                        {["Instant lead notifications", "Automated AI verification badges", "Secure escrow payments"].map((item, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "15px", fontSize: "1.1rem", fontWeight: "600" }}>
                                <div style={{ background: "var(--primary)", borderRadius: "50%", p: "5px" }}><CheckCircle size={18} /></div> {item}
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={() => window.location.href = '/become-provider'}
                        style={{ padding: "20px 50px", borderRadius: "15px", background: "white", color: "#1e293b", fontWeight: "900", border: "none", fontSize: "1.2rem", cursor: "pointer" }}
                    >
                        Partner with HalpHub
                    </button>
                </div>
                <div style={{ position: "relative" }}>
                    <motion.img 
                        animate={{ y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800" 
                        alt="Business team" 
                        style={{ width: "100%", borderRadius: "40px", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}
                    />
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
