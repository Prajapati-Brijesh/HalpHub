import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Mail, Lock, User, Star, FileText, Camera, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

function BecomeProvider() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "provider",
    category: "",
    experience: "",
    bio: "",
    verification_image: ""
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await signUp(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Business Registered Successfully!");
      navigate("/provider-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Account", icon: <User size={20} /> },
    { title: "Business", icon: <Briefcase size={20} /> },
    { title: "Verify", icon: <Camera size={20} /> }
  ];

  return (
    <div style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px"
    }}>
      <div className="card" style={{ width: "100%", maxWidth: "600px", padding: "0", overflow: "hidden" }}>
        {/* Progress Header */}
        <div style={{ background: "#1e293b", padding: "30px", color: "white" }}>
            <h2 style={{ margin: "0 0 20px 0", textAlign: "center" }}>Partner with HalpHub</h2>
            <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                <div style={{ position: "absolute", top: "20px", left: "10%", right: "10%", height: "2px", background: "rgba(255,255,255,0.1)", zIndex: 0 }}>
                    <div style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%`, height: "100%", background: "var(--primary)", transition: "0.3s" }}></div>
                </div>
                {steps.map((s, i) => (
                    <div key={i} style={{ position: "relative", zIndex: 1, textAlign: "center", width: "80px" }}>
                        <div style={{ 
                            width: "40px", 
                            height: "40px", 
                            borderRadius: "50%", 
                            background: step > i + 1 ? "var(--primary)" : (step === i + 1 ? "var(--primary)" : "#334155"),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 8px",
                            border: "4px solid #1e293b",
                            transition: "0.3s"
                        }}>
                            {step > i + 1 ? <CheckCircle size={20} /> : s.icon}
                        </div>
                        <span style={{ fontSize: "0.75rem", opacity: step === i + 1 ? 1 : 0.6 }}>{s.title}</span>
                    </div>
                ))}
            </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "40px" }}>
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                        <h3 style={{ marginBottom: "24px" }}>Create your professional account</h3>
                        <div style={{ display: "grid", gap: "20px" }}>
                            <div className="input-group">
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Full Name</label>
                                <div style={{ position: "relative" }}>
                                    <User style={{ position: "absolute", left: "15px", top: "12px", color: "#94a3b8" }} size={18} />
                                    <input 
                                        required
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        style={{ width: "100%", padding: "12px 12px 12px 45px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Business Email</label>
                                <div style={{ position: "relative" }}>
                                    <Mail style={{ position: "absolute", left: "15px", top: "12px", color: "#94a3b8" }} size={18} />
                                    <input 
                                        required
                                        type="email"
                                        placeholder="email@business.com"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        style={{ width: "100%", padding: "12px 12px 12px 45px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Password</label>
                                <div style={{ position: "relative" }}>
                                    <Lock style={{ position: "absolute", left: "15px", top: "12px", color: "#94a3b8" }} size={18} />
                                    <input 
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        style={{ width: "100%", padding: "12px 12px 12px 45px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                        <h3 style={{ marginBottom: "24px" }}>Business Details</h3>
                        <div style={{ display: "grid", gap: "20px" }}>
                            <div className="input-group">
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Service Category</label>
                                <select 
                                    required
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Painting">Painting</option>
                                    <option value="Moving">Moving & Packing</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Years of Experience</label>
                                <input 
                                    required
                                    type="number"
                                    placeholder="e.g. 5"
                                    value={formData.experience}
                                    onChange={e => setFormData({...formData, experience: e.target.value})}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Short Bio</label>
                                <textarea 
                                    placeholder="Tell us about your business..."
                                    value={formData.bio}
                                    onChange={e => setFormData({...formData, bio: e.target.value})}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", height: "100px" }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                        <h3 style={{ marginBottom: "24px" }}>Identity Verification</h3>
                        <p style={{ color: "#64748b", marginBottom: "24px" }}>Please upload a clear photo of your business license or ID card for verification.</p>
                        
                        <div 
                            onClick={() => setFormData({...formData, verification_image: "https://images.unsplash.com/photo-1554224155-169641357599?w=400"})}
                            style={{ 
                                height: "200px", 
                                border: "2px dashed #cbd5e1", 
                                borderRadius: "12px", 
                                display: "flex", 
                                flexDirection: "column", 
                                alignItems: "center", 
                                justifyContent: "center",
                                cursor: "pointer",
                                background: formData.verification_image ? `url(${formData.verification_image}) center/cover` : "#f8fafc",
                                transition: "0.3s"
                            }}
                        >
                            {!formData.verification_image && (
                                <>
                                    <Camera size={40} color="#94a3b8" />
                                    <span style={{ marginTop: "10px", color: "#94a3b8" }}>Click to upload document</span>
                                </>
                            )}
                        </div>
                        
                        <div style={{ marginTop: "24px", padding: "15px", background: "#f0fdf4", borderRadius: "8px", display: "flex", gap: "10px" }}>
                            <CheckCircle size={20} color="#166534" />
                            <p style={{ fontSize: "0.85rem", color: "#166534", margin: 0 }}>This information is secure and will only be used for verification purposes.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: "flex", gap: "15px", marginTop: "40px" }}>
                {step > 1 && (
                    <button type="button" onClick={handleBack} style={{ flex: 1, padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", fontWeight: "700", cursor: "pointer" }}>Back</button>
                )}
                {step < 3 ? (
                    <button type="button" onClick={handleNext} className="btn-primary" style={{ flex: 2, padding: "15px", borderRadius: "8px", fontWeight: "700" }}>Continue</button>
                ) : (
                    <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 2, padding: "15px", borderRadius: "8px", fontWeight: "700" }}>
                        {loading ? "Registering..." : "Finish Registration"}
                    </button>
                )}
            </div>
        </form>
      </div>
    </div>
  );
}

export default BecomeProvider;
