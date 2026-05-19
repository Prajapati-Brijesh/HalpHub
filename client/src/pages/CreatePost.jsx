import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createService } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, MapPin, DollarSign, FileText, Tag,
  Image, CheckCircle, ArrowRight, ArrowLeft, Zap, Star, Camera, Search, Globe
} from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Plumbing", "Electrical", "Painting", "Carpentry", "Cleaning",
  "Gardening", "AC Repair", "Appliance Repair", "Security", "IT Support",
  "Photography", "Catering", "Tutoring", "Beauty & Salon", "Other"
];



function CreatePost() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    location: "",
    image: "",
  });

  // Camera & Image Search States
  const [cameraActive, setCameraActive] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const [webSearchOpen, setWebSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleWebSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return toast.error("Search query type karein!");
    setSearching(true);
    
    // Using loremflickr keyless endpoint to fetch stunning, highly relevant images in real-time
    const q = encodeURIComponent(searchQuery.trim());
    const variations = ["repair", "service", "work", "tools", "professional", "detail"];
    
    setTimeout(() => {
      const results = variations.map((val, idx) => {
        return `https://loremflickr.com/600/400/${q},${val}?lock=${idx + 1}`;
      });
      setSearchResults(results);
      setSearching(false);
      toast.success("Web matching images loaded! 🌐");
    }, 1200);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result });
        toast.success("Gallery se image select ho gayi! 🖼️");
      };
      reader.readAsDataURL(file);
    }
  };

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" } // Prefers rear camera on mobiles, fallbacks to front
      });
      setVideoStream(stream);
      setCameraActive(true);
      toast.success("Camera started! 📸");
    } catch (err) {
      toast.error("Camera support nahi mila ya permission blocked hai.");
      console.error(err);
    }
  };

  // Set the srcObject once the videoRef becomes available
  useEffect(() => {
    if (cameraActive && videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [cameraActive, videoStream]);

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
    setVideoStream(null);
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setForm({ ...form, image: dataUrl });
      stopCamera();
      toast.success("Photo capture ho gayi!");
    }
  };

  if (!user || user.role !== "provider") {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
        <div>
          <Zap size={60} style={{ color: "#ef4444", marginBottom: "20px" }} />
          <h2>Providers Only</h2>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>You must be logged in as a provider to post an ad.</p>
          <button className="btn-primary" onClick={() => navigate("/become-provider")}>Register as Provider</button>
        </div>
      </div>
    );
  }

  const coins = user.halp_coins ?? 0;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.price || !form.description || !form.location) {
      return toast.error("Sabhi fields fill karo!");
    }
    if (coins < 50) {
      return toast.error("Insufficient HalpCoins! Admin se coins lene ke liye contact karein.", { duration: 5000 });
    }
    setLoading(true);
    try {
      const res = await createService(form);
      toast.success("Ad successfully post ho gayi! 50 coins deducted.", { duration: 4000 });
      const updatedUser = { ...user, halp_coins: res.data.new_balance ?? coins - 50 };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate("/provider-dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Ad post karne mein error aaya.";
      toast.error(msg, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "Basic Info" },
    { num: 2, label: "Details" },
    { num: 3, label: "Preview" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", padding: "40px 20px" }}>
      <div style={{ maxWidth: "750px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#1e293b", marginBottom: "10px" }}>
            Post a New Ad
          </h1>
          <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
            Apni service list karo aur nayi bookings pao
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: coins >= 50 ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${coins >= 50 ? "#86efac" : "#fca5a5"}`,
            borderRadius: "12px", padding: "10px 20px", marginTop: "15px"
          }}>
            <div style={{ background: "#f59e0b", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem", fontWeight: "900" }}>H</div>
            <span style={{ fontWeight: "700", color: coins >= 50 ? "#166534" : "#ef4444" }}>
              Aapke paas {coins} HalpCoins hain — Ad post karne ke liye 50 coins lagenge
            </span>
          </div>
        </motion.div>

        {/* Step Indicator */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "0", marginBottom: "40px" }}>
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: step >= s.num ? "var(--primary)" : "#e2e8f0",
                  color: step >= s.num ? "white" : "#94a3b8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "800", fontSize: "1.1rem", transition: "all 0.3s",
                  boxShadow: step === s.num ? "0 0 0 4px rgba(99,102,241,0.2)" : "none"
                }}>
                  {step > s.num ? <CheckCircle size={20} /> : s.num}
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: "600", color: step >= s.num ? "var(--primary)" : "#94a3b8" }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: "2px", background: step > s.num ? "var(--primary)" : "#e2e8f0", marginTop: "22px", maxWidth: "80px", transition: "background 0.3s" }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <motion.div className="card" style={{ padding: "40px", borderRadius: "24px" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={step}>
          <AnimatePresence mode="wait">

            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ marginBottom: "30px", fontSize: "1.5rem", fontWeight: "800" }}>Basic Information</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#374151" }}>
                      <Briefcase size={16} color="var(--primary)" /> Service Title
                    </label>
                    <input name="title" value={form.title} onChange={handleChange}
                      placeholder="e.g. Expert Plumber for Home Repairs"
                      style={{ width: "100%", padding: "14px", fontSize: "1rem", border: "2px solid #e2e8f0", borderRadius: "12px", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#374151" }}>
                      <Tag size={16} color="var(--primary)" /> Category
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setForm({ ...form, category: cat })} style={{
                          padding: "8px 16px", borderRadius: "20px", border: "2px solid",
                          borderColor: form.category === cat ? "var(--primary)" : "#e2e8f0",
                          background: form.category === cat ? "var(--primary)" : "white",
                          color: form.category === cat ? "white" : "#374151",
                          fontWeight: "600", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s"
                        }}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#374151" }}>
                      <MapPin size={16} color="var(--primary)" /> Location
                    </label>
                    <input name="location" value={form.location} onChange={handleChange}
                      placeholder="e.g. Kadi, Gujarat"
                      style={{ width: "100%", padding: "14px", fontSize: "1rem", border: "2px solid #e2e8f0", borderRadius: "12px", outline: "none" }} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ marginBottom: "30px", fontSize: "1.5rem", fontWeight: "800" }}>Service Details</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#374151" }}>
                      <DollarSign size={16} color="var(--primary)" /> Price (₹)
                    </label>
                    <input name="price" type="number" value={form.price} onChange={handleChange}
                      placeholder="e.g. 500"
                      style={{ width: "100%", padding: "14px", fontSize: "1rem", border: "2px solid #e2e8f0", borderRadius: "12px", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#374151" }}>
                      <FileText size={16} color="var(--primary)" /> Description
                    </label>
                    <textarea name="description" value={form.description} onChange={handleChange}
                      placeholder="Apni service ke bare mein detail mein batao..."
                      style={{ width: "100%", padding: "14px", fontSize: "1rem", border: "2px solid #e2e8f0", borderRadius: "12px", outline: "none", minHeight: "120px", resize: "vertical" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#374151" }}>
                      <Image size={16} color="var(--primary)" /> Cover Image
                    </label>

                    {/* Camera / Gallery / Web Search Option */}
                    <div style={{ marginBottom: "20px" }}>
                      {!cameraActive ? (
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={() => { startCamera(); setWebSearchOpen(false); }}
                            style={{
                              flex: "1 1 140px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              padding: "14px",
                              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              color: "white",
                              fontWeight: "800",
                              border: "none",
                              borderRadius: "12px",
                              cursor: "pointer",
                              boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.15)",
                              transition: "all 0.2s"
                            }}
                          >
                            <Camera size={18} /> Live Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => { fileInputRef.current.click(); setWebSearchOpen(false); }}
                            style={{
                              flex: "1 1 140px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              padding: "14px",
                              background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
                              color: "white",
                              fontWeight: "800",
                              border: "none",
                              borderRadius: "12px",
                              cursor: "pointer",
                              boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.15)",
                              transition: "all 0.2s"
                            }}
                          >
                            <Image size={18} /> Open Gallery
                          </button>
                          <button
                            type="button"
                            onClick={() => setWebSearchOpen(!webSearchOpen)}
                            style={{
                              flex: "1 1 140px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              padding: "14px",
                              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                              color: "white",
                              fontWeight: "800",
                              border: "none",
                              borderRadius: "12px",
                              cursor: "pointer",
                              boxShadow: "0 4px 6px -1px rgba(245, 158, 11, 0.15)",
                              transition: "all 0.2s"
                            }}
                          >
                            <Search size={18} /> Search Web
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                          />
                        </div>
                      ) : (
                        <div style={{
                          background: "#0f172a",
                          borderRadius: "16px",
                          overflow: "hidden",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: "15px",
                          border: "2px solid #10b981"
                        }}>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            style={{
                              width: "100%",
                              maxHeight: "300px",
                              borderRadius: "12px",
                              objectFit: "cover",
                              background: "#000"
                            }}
                          />
                          <div style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "15px",
                            width: "100%",
                            justifyContent: "center"
                          }}>
                            <button
                              type="button"
                              onClick={capturePhoto}
                              className="btn-primary"
                              style={{
                                flex: 1,
                                padding: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px"
                              }}
                            >
                              <Camera size={18} /> Capture Photo
                            </button>
                            <button
                              type="button"
                              onClick={stopCamera}
                              style={{
                                padding: "12px 20px",
                                background: "#ef4444",
                                color: "white",
                                fontWeight: "800",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer"
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Web Image Search Widget */}
                    <AnimatePresence>
                      {webSearchOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{
                            background: "#f8fafc",
                            border: "2px solid #f59e0b",
                            borderRadius: "16px",
                            padding: "20px",
                            marginBottom: "20px",
                            overflow: "hidden"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                            <Globe size={18} color="#f59e0b" />
                            <h4 style={{ margin: 0, fontWeight: "800", color: "#1e293b", fontSize: "0.95rem" }}>Google / Web Image Search</h4>
                          </div>

                          <form onSubmit={handleWebSearch} style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="e.g. kitchen plumbing, painting wall, electrician tools..."
                              style={{
                                flex: 1,
                                padding: "12px",
                                border: "2px solid #e2e8f0",
                                borderRadius: "10px",
                                outline: "none",
                                fontSize: "0.9rem"
                              }}
                            />
                            <button
                              type="submit"
                              disabled={searching}
                              style={{
                                padding: "12px 20px",
                                background: "#f59e0b",
                                color: "white",
                                fontWeight: "800",
                                border: "none",
                                borderRadius: "10px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                              }}
                            >
                              <Search size={16} /> {searching ? "Searching..." : "Search"}
                            </button>
                          </form>

                          {searching ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px" }}>
                              <div style={{
                                width: "30px",
                                height: "30px",
                                border: "3px solid #f3f3f3",
                                borderTop: "3px solid #f59e0b",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite",
                                marginBottom: "10px"
                              }} />
                              <style>{`
                                @keyframes spin {
                                  0% { transform: rotate(0deg); }
                                  100% { transform: rotate(360deg); }
                                }
                              `}</style>
                              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>Searching Google & Web Images...</span>
                            </div>
                          ) : (
                            searchResults.length > 0 && (
                              <div>
                                <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700", marginBottom: "10px" }}>Select a photo to set as cover image:</p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                                  {searchResults.map((img, i) => (
                                    <div
                                      key={i}
                                      onClick={() => {
                                        setForm({ ...form, image: img });
                                        toast.success("Web Image set successfully! 🌐");
                                      }}
                                      style={{
                                        position: "relative",
                                        cursor: "pointer",
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        border: form.image === img ? "3px solid #f59e0b" : "3px solid transparent",
                                        transition: "all 0.2s",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                      }}
                                    >
                                      <img src={img} alt={`Search Result ${i}`} style={{ width: "100%", height: "80px", objectFit: "cover" }} />
                                      {form.image === img && (
                                        <div style={{
                                          position: "absolute",
                                          top: "4px",
                                          right: "4px",
                                          background: "#f59e0b",
                                          color: "white",
                                          borderRadius: "50%",
                                          width: "18px",
                                          height: "18px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center"
                                        }}>
                                          <CheckCircle size={12} />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {form.image && (form.image.startsWith("data:") || form.image.startsWith("http")) && (
                      <div style={{ marginBottom: "15px", textAlign: "center" }}>
                        <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#10b981", marginBottom: "8px" }}>✓ Selected Image Preview:</p>
                        <div style={{ position: "relative", display: "inline-block", borderRadius: "12px", overflow: "hidden", border: "3px solid #10b981" }}>
                          <img src={form.image} alt="Selected" style={{ maxHeight: "150px", objectFit: "contain" }} />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, image: "" })}
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              background: "rgba(239, 68, 68, 0.9)",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: "24px",
                              height: "24px",
                              cursor: "pointer",
                              fontWeight: "bold",
                              fontSize: "0.8rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}

                    <input name="image" value={form.image.startsWith("data:") ? "Selected Local Image File" : form.image.startsWith("https://loremflickr.com") ? "Web Image Search Result" : form.image} onChange={handleChange}
                      placeholder="Image URL paste karo ya use standard/captured photo"
                      disabled={form.image.startsWith("data:") || form.image.startsWith("https://loremflickr.com")}
                      style={{ width: "100%", padding: "14px", fontSize: "1rem", border: "2px solid #e2e8f0", borderRadius: "12px", outline: "none", marginBottom: "15px", background: (form.image.startsWith("data:") || form.image.startsWith("https://loremflickr.com")) ? "#f1f5f9" : "white" }} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ marginBottom: "25px", fontSize: "1.5rem", fontWeight: "800" }}>Preview & Post</h2>
                <div className="card" style={{ padding: "0", overflow: "hidden", marginBottom: "25px", border: "2px solid var(--primary)" }}>
                  {form.image && <img src={form.image} alt="cover" style={{ width: "100%", height: "200px", objectFit: "cover" }} />}
                  <div style={{ padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                      <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "800" }}>{form.title || "Service Title"}</h3>
                      <span style={{ background: "var(--primary)", color: "white", padding: "6px 14px", borderRadius: "20px", fontWeight: "700" }}>₹{form.price || "0"}</span>
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px", background: "#f1f5f9", padding: "4px 10px", borderRadius: "20px", fontSize: "0.85rem" }}>
                        <Tag size={14} /> {form.category || "Category"}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px", background: "#f1f5f9", padding: "4px 10px", borderRadius: "20px", fontSize: "0.85rem" }}>
                        <MapPin size={14} /> {form.location || "Location"}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px", background: "#fff7ed", padding: "4px 10px", borderRadius: "20px", fontSize: "0.85rem", color: "#d97706" }}>
                        <Star size={14} fill="#d97706" /> New Listing
                      </span>
                    </div>
                    <p style={{ color: "#64748b", lineHeight: "1.6", margin: 0 }}>{form.description || "Description..."}</p>
                  </div>
                </div>

                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#64748b" }}>Listing Cost</span>
                    <span style={{ fontWeight: "700" }}>50 HalpCoins</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Aapke coins</span>
                    <span style={{ fontWeight: "700", color: coins >= 50 ? "#10b981" : "#ef4444" }}>{coins} coins</span>
                  </div>
                  <div style={{ borderTop: "1px solid #e2e8f0", marginTop: "12px", paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "700" }}>Post karne ke baad</span>
                    <span style={{ fontWeight: "800", color: "var(--primary)" }}>{Math.max(0, coins - 50)} coins bachenge</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "35px", gap: "15px" }}>
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "white", border: "2px solid #e2e8f0", borderRadius: "12px", fontWeight: "700", cursor: "pointer", color: "#374151" }}>
                <ArrowLeft size={18} /> Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button onClick={() => {
                if (step === 1 && (!form.title || !form.category || !form.location)) return toast.error("Title, Category aur Location fill karo!");
                if (step === 2 && (!form.price || !form.description)) return toast.error("Price aur Description zaroori hai!");
                setStep(step + 1);
              }} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 30px" }}>
                Next <ArrowRight size={18} />
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSubmit} disabled={loading || coins < 50}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 35px", opacity: loading || coins < 50 ? 0.6 : 1 }}>
                {loading ? "Posting..." : <><Zap size={18} /> Post Ad Now (50 Coins)</>}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CreatePost;
