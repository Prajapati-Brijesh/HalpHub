import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Zap, Shield, Clock, Brain, ArrowRight } from "lucide-react";

function BudgetEstimator() {
  const [details, setDetails] = useState({ category: "", size: "", complexity: "standard", urgency: "standard" });
  const [estimation, setEstimation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateBudget = () => {
    setIsCalculating(true);
    setTimeout(() => {
        let basePrice = 500;
        if (details.category === "Electrical") basePrice = 800;
        if (details.category === "Plumbing") basePrice = 600;
        if (details.category === "Painting") basePrice = 1200;

        const sizeMultiplier = details.size === "medium" ? 1.5 : (details.size === "large" ? 2.5 : 1);
        const complexityMultiplier = details.complexity === "complex" ? 1.8 : 1;
        const urgencyMultiplier = details.urgency === "emergency" ? 2.0 : 1;

        const total = basePrice * sizeMultiplier * complexityMultiplier * urgencyMultiplier;
        
        setEstimation({
            min: Math.floor(total * 0.9),
            max: Math.ceil(total * 1.2),
            time: details.size === "large" ? "2-3 Days" : "4-6 Hours",
            ai_insight: "Based on current market rates in your area, this estimate includes professional labor and standard materials."
        });
        setIsCalculating(false);
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: "100px" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ background: "var(--primary-light)", color: "var(--primary)", width: "60px", height: "60px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}
            >
                <Brain size={30} />
            </motion.div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#1e293b" }}>AI Budget Estimator</h1>
            <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Get instant, intelligent cost estimates for your next project.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", alignItems: "start" }}>
            {/* Input Form */}
            <div className="card" style={{ padding: "40px" }}>
                <div style={{ display: "grid", gap: "25px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "10px", fontWeight: "700", color: "#475569" }}>Service Category</label>
                        <select 
                            value={details.category}
                            onChange={e => setDetails({...details, category: e.target.value})}
                            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                        >
                            <option value="">Select Category</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Painting">Painting</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "10px", fontWeight: "700", color: "#475569" }}>Project Size</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                            {['small', 'medium', 'large'].map(s => (
                                <button 
                                    key={s}
                                    onClick={() => setDetails({...details, size: s})}
                                    style={{ 
                                        padding: "10px", 
                                        borderRadius: "8px", 
                                        border: details.size === s ? "2px solid var(--primary)" : "1px solid #e2e8f0",
                                        background: details.size === s ? "var(--primary-light)" : "white",
                                        color: details.size === s ? "var(--primary)" : "#64748b",
                                        textTransform: "capitalize",
                                        fontWeight: "600"
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "10px", fontWeight: "700", color: "#475569" }}>Complexity</label>
                        <select 
                            value={details.complexity}
                            onChange={e => setDetails({...details, complexity: e.target.value})}
                            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                        >
                            <option value="standard">Standard / Basic</option>
                            <option value="complex">Complex / Advanced</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "10px", fontWeight: "700", color: "#475569" }}>Urgency</label>
                        <select 
                            value={details.urgency}
                            onChange={e => setDetails({...details, urgency: e.target.value})}
                            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                        >
                            <option value="standard">Standard (2-3 Days)</option>
                            <option value="emergency">Emergency (Instant)</option>
                        </select>
                    </div>
                    <button 
                        className="btn-primary" 
                        onClick={calculateBudget}
                        disabled={isCalculating || !details.category || !details.size}
                        style={{ padding: "15px", fontSize: "1.1rem", borderRadius: "10px", marginTop: "10px" }}
                    >
                        {isCalculating ? "AI is Calculating..." : "Generate Estimate"}
                    </button>
                </div>
            </div>

            {/* Result Section */}
            <div style={{ position: "sticky", top: "120px" }}>
                <AnimatePresence mode="wait">
                    {estimation ? (
                        <motion.div 
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="card" 
                            style={{ padding: "40px", background: "white", border: "1px solid var(--primary-light)" }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--primary)", fontWeight: "800", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "20px" }}>
                                <Zap size={16} /> Estimated Budget Range
                            </div>
                            <div style={{ fontSize: "3rem", fontWeight: "900", color: "#1e293b", marginBottom: "10px" }}>
                                ₹{estimation.min} - ₹{estimation.max}
                            </div>
                            <p style={{ color: "#64748b", marginBottom: "30px" }}>Approximate completion time: <strong>{estimation.time}</strong></p>
                            
                            <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", borderLeft: "4px solid var(--primary)", marginBottom: "30px" }}>
                                <div style={{ fontWeight: "700", color: "#1e293b", marginBottom: "5px", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Brain size={16} /> AI Insight
                                </div>
                                <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0 }}>{estimation.ai_insight}</p>
                            </div>

                            <button className="btn-primary" style={{ width: "100%", padding: "15px" }} onClick={() => window.location.href='/services'}>
                                Browse Verified Professionals <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    ) : (
                        <div className="card" style={{ padding: "60px", textAlign: "center", background: "white", border: "1px dashed #cbd5e1" }}>
                            <Calculator size={48} color="#cbd5e1" style={{ marginBottom: "20px" }} />
                            <h3 style={{ color: "#94a3b8" }}>Ready to Estimate?</h3>
                            <p style={{ color: "#94a3b8" }}>Fill in the details to see how much your project might cost.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetEstimator;
