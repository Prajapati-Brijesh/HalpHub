import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, CheckCircle, Loader2, CreditCard, ShieldCheck, ArrowLeft, Info } from "lucide-react";
import toast from "react-hot-toast";

function UPIDialog({ isOpen, onClose, amount, onSuccess }) {
  const [step, setStep] = useState("select"); // select, details, processing, success
  const [selectedApp, setSelectedApp] = useState(null);
  const [txId, setTxId] = useState("");

  useEffect(() => {
    if (isOpen) {
        setTxId("HHP-" + Math.random().toString(36).substr(2, 9).toUpperCase());
    }
  }, [isOpen]);

  const handleSelect = (app) => {
    setSelectedApp(app);
    setStep("details");
  };

  const handleConfirm = () => {
    setStep("processing");
    
    // Simulate App Switching & Payment
    setTimeout(() => {
        setStep("success");
        toast.success(`Payment of ₹${amount} successful via ${selectedApp}!`);
        setTimeout(() => {
            onSuccess(amount);
            onClose();
            setStep("select");
        }, 2000);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "white",
              borderRadius: "32px",
              overflow: "hidden",
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
            }}
          >
            {/* Header */}
            <div style={{ padding: "25px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {step === "details" && <button onClick={() => setStep("select")} style={{ background: "none", border: "none", cursor: "pointer" }}><ArrowLeft size={18} /></button>}
                <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>{step === "details" ? "Payment Details" : "UPI Payment"}</div>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>

            <div style={{ padding: "30px" }}>
                {step === "select" && (
                    <>
                        <div style={{ textAlign: "center", marginBottom: "30px" }}>
                            <div style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "5px" }}>Amount to Pay</div>
                            <div style={{ fontSize: "2.5rem", fontWeight: "900", color: "#1e293b" }}>₹{amount}</div>
                        </div>

                        <div style={{ display: "grid", gap: "15px" }}>
                            {[
                                { name: "Google Pay", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg", color: "#4285F4" },
                                { name: "PhonePe", logo: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg", color: "#6739B7" },
                                { name: "Paytm", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg", color: "#00B9F1" }
                            ].map(app => (
                                <button 
                                    key={app.name}
                                    onClick={() => handleSelect(app.name)}
                                    style={{ 
                                        display: "flex", alignItems: "center", gap: "15px", padding: "18px", borderRadius: "18px", border: "1px solid #e2e8f0", 
                                        background: "white", cursor: "pointer", transition: "0.2s" 
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = app.color}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                                >
                                    <div style={{ width: "45px", height: "45px", borderRadius: "12px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img src={app.logo} alt={app.name} style={{ width: app.name === "Paytm" ? "35px" : "30px" }} />
                                    </div>
                                    <div style={{ textAlign: "left" }}>
                                        <div style={{ fontWeight: "700" }}>{app.name}</div>
                                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Secure checkout via UPI</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {step === "details" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ background: "#f8fafc", padding: "25px", borderRadius: "24px", marginBottom: "30px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                                <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Merchant</span>
                                <span style={{ fontWeight: "700", color: "#1e293b" }}>HalpHub Services</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                                <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Transaction ID</span>
                                <span style={{ fontWeight: "700", color: "#1e293b", fontFamily: "monospace" }}>{txId}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                                <span style={{ color: "#64748b", fontSize: "0.9rem" }}>UPI ID</span>
                                <span style={{ fontWeight: "700", color: "#1e293b" }}>halphub@upi</span>
                            </div>
                            <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "20px", display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontWeight: "800", color: "#1e293b" }}>Total Amount</span>
                                <span style={{ fontWeight: "900", color: "var(--primary)", fontSize: "1.3rem" }}>₹{amount}</span>
                            </div>
                        </div>
                        
                        <div style={{ background: "#f0f9ff", padding: "15px", borderRadius: "12px", display: "flex", gap: "10px", marginBottom: "30px" }}>
                            <Info size={18} color="#0369a1" />
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "#0369a1" }}>You will be redirected to the <strong>{selectedApp}</strong> app to enter your UPI PIN.</p>
                        </div>

                        <button 
                            onClick={handleConfirm}
                            className="btn-primary" 
                            style={{ width: "100%", padding: "18px", borderRadius: "18px", fontSize: "1.1rem", fontWeight: "800" }}
                        >
                            Confirm & Pay
                        </button>
                    </motion.div>
                )}

                {step === "processing" && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                            <Loader2 size={60} color="var(--primary)" style={{ margin: "0 auto 20px" }} />
                        </motion.div>
                        <h3 style={{ fontSize: "1.4rem", fontWeight: "800", marginBottom: "10px" }}>Opening {selectedApp}...</h3>
                        <p style={{ color: "#64748b" }}>Please complete the payment in your mobile app. Do not refresh this page.</p>
                    </div>
                )}

                {step === "success" && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                            <CheckCircle size={80} color="#10b981" style={{ margin: "0 auto 20px" }} />
                        </motion.div>
                        <h3 style={{ fontSize: "1.6rem", fontWeight: "900", color: "#10b981", marginBottom: "10px" }}>Payment Successful!</h3>
                        <p style={{ color: "#64748b" }}>Amount of ₹{amount} has been added to your HalpHub Wallet.</p>
                    </div>
                )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default UPIDialog;
