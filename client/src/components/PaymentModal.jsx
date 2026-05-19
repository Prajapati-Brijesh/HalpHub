import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  ShieldCheck, 
  Loader2, 
  CheckCircle, 
  Lock, 
  Smartphone, 
  Wallet, 
  Building2,
  QrCode,
  Info
} from "lucide-react";
import { processPayment } from "../api";

function PaymentModal({ isOpen, onClose, onPaymentSuccess, amount }) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi, card, wallet, netbanking
  const [userCoins, setUserCoins] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserCoins(user.halp_coins || 0);
  }, [isOpen]);

  const [redirecting, setRedirecting] = useState(null); // null or "GPay", "PhonePe", etc.

  const handlePay = async (methodName = null) => {
    if (methodName) {
      setRedirecting(methodName);
      await new Promise(r => setTimeout(r, 1500)); // Simulate app launch delay
      setRedirecting(null);
    }
    
    setProcessing(true);
    await processPayment();
    setProcessing(false);
    setSuccess(true);
    setTimeout(() => {
      onPaymentSuccess(paymentMethod);
      setSuccess(false);
    }, 1500);
  };

  const methods = [
    { id: "upi", label: "UPI", icon: <Smartphone size={20} /> },
    { id: "card", label: "Card", icon: <CreditCard size={20} /> },
    { id: "wallet", label: "Wallet", icon: <Wallet size={20} /> },
    { id: "netbanking", label: "Bank", icon: <Building2 size={20} /> }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(15, 23, 42, 0.8)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 2000, backdropFilter: "blur(12px)"
        }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="card" 
            style={{ width: "95%", maxWidth: "480px", padding: 0, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", border: "none" }}
          >
            {redirecting ? (
              <div style={{ padding: "80px 20px", textAlign: "center", background: "white" }}>
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Smartphone size={60} color="var(--primary)" style={{ margin: "0 auto 30px" }} />
                </motion.div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "800" }}>Opening {redirecting}...</h2>
                <p style={{ color: "#64748b" }}>Please complete the payment in your app.</p>
                <div style={{ width: "200px", height: "4px", background: "#f1f5f9", borderRadius: "2px", margin: "30px auto", overflow: "hidden" }}>
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: "50%", height: "100%", background: "var(--primary)" }}
                  />
                </div>
              </div>
            ) : success ? (
              <div style={{ padding: "80px 20px", textAlign: "center", background: "white" }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                  <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 30px" }}>
                    <CheckCircle size={60} color="#10b981" />
                  </div>
                </motion.div>
                <h2 style={{ color: "#1e293b", fontSize: "1.75rem", fontWeight: "800", marginBottom: "10px" }}>Payment Received!</h2>
                <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Your service has been booked successfully.</p>
              </div>
            ) : (
              <div style={{ background: "white" }}>
                {/* Header */}
                <div style={{ padding: "30px", background: "var(--primary)", color: "white" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ margin: "0 0 5px 0", fontSize: "1.4rem", fontWeight: "800", color: "white" }}>Checkout</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem" }}>
                        <Lock size={14} /> 256-bit Secure SSL
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>Total Amount</div>
                      <div style={{ fontSize: "1.8rem", fontWeight: "800" }}>₹{amount}</div>
                    </div>
                  </div>
                </div>

                {/* Method Selector */}
                <div style={{ display: "flex", padding: "10px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  {methods.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      style={{
                        flex: 1,
                        padding: "12px 5px",
                        background: paymentMethod === m.id ? "white" : "transparent",
                        border: "none",
                        borderRadius: "8px",
                        color: paymentMethod === m.id ? "var(--primary)" : "#64748b",
                        fontWeight: "700",
                        fontSize: "0.85rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: paymentMethod === m.id ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none",
                        transition: "all 0.2s"
                      }}
                    >
                      {m.icon}
                      {m.label}
                    </button>
                  ))}
                </div>

                <div style={{ padding: "30px" }}>
                  <AnimatePresence mode="wait">
                    {paymentMethod === 'upi' && (
                      <motion.div key="upi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div style={{ textAlign: "center", padding: "10px 0" }}>
                          <div style={{ width: "140px", height: "140px", background: "white", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "12px", margin: "0 auto 20px" }}>
                            <QrCode size="100%" color="#1e293b" />
                          </div>
                          <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "24px" }}>Scan this QR using GPay, PhonePe, or Paytm</p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                            <button onClick={() => handlePay('PhonePe')} style={{ background: "#f1f5f9", color: "#1e293b", border: "1px solid #e2e8f0", padding: "12px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "600" }}>PhonePe</button>
                            <button onClick={() => handlePay('Google Pay')} style={{ background: "#f1f5f9", color: "#1e293b", border: "1px solid #e2e8f0", padding: "12px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "600" }}>Google Pay</button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'card' && (
                      <motion.form key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handlePay}>
                        <div style={{ marginBottom: "20px" }}>
                          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" }}>Card Number</label>
                          <div style={{ display: "flex", alignItems: "center", padding: "14px", border: "1.5px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                            <CreditCard size={20} color="#64748b" style={{ marginRight: "12px" }} />
                            <input required type="text" placeholder="0000 0000 0000 0000" style={{ border: "none", background: "transparent", width: "100%", outline: "none", fontSize: "1rem" }} />
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" }}>Expiry</label>
                            <input required type="text" placeholder="MM / YY" style={{ width: "100%", padding: "14px", border: "1.5px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc", outline: "none" }} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" }}>CVC</label>
                            <input required type="text" placeholder="***" style={{ width: "100%", padding: "14px", border: "1.5px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc", outline: "none" }} />
                          </div>
                        </div>
                      </motion.form>
                    )}

                    {paymentMethod === 'wallet' && (
                      <motion.div key="wallet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div style={{ background: "linear-gradient(135deg, #4f46e5, #818cf8)", padding: "24px", borderRadius: "16px", color: "white", marginBottom: "24px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>HalpCoins Balance</span>
                            <Wallet size={24} />
                          </div>
                          <div style={{ fontSize: "2rem", fontWeight: "800" }}>{userCoins} <span style={{ fontSize: "1rem", fontWeight: "400" }}>Coins</span></div>
                        </div>
                        <div style={{ display: "flex", alignItems: "start", gap: "12px", padding: "16px", background: "#fff7ed", borderRadius: "12px", border: "1px solid #ffedd5", color: "#9a3412", fontSize: "0.85rem", marginBottom: "24px" }}>
                          <Info size={20} />
                          <span>1 HalpCoin = ₹1. You will have {userCoins - amount} coins left after this booking.</span>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'netbanking' && (
                      <motion.div key="netbanking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginBottom: "24px" }}>
                          {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map(bank => (
                            <button key={bank} onClick={handlePay} style={{ textAlign: "left", padding: "16px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "600", color: "#1e293b" }}>
                              {bank}
                              <ArrowUpRight size={18} color="#94a3b8" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    onClick={handlePay}
                    disabled={processing || (paymentMethod === 'wallet' && userCoins < amount)}
                    style={{ 
                      width: "100%", 
                      padding: "18px", 
                      borderRadius: "14px", 
                      fontSize: "1.1rem", 
                      fontWeight: "800", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      gap: "12px", 
                      background: processing ? "#6366f1" : "var(--primary)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      opacity: (paymentMethod === 'wallet' && userCoins < amount) ? 0.5 : 1
                    }}
                  >
                    {processing ? <Loader2 className="animate-spin" size={22} /> : <CheckCircle size={22} />}
                    {processing ? "Confirming..." : (paymentMethod === 'wallet' && userCoins < amount ? "Insufficient Coins" : `Pay ₹${amount}`)}
                  </button>
                  
                  <button type="button" onClick={onClose} style={{ width: "100%", background: "none", border: "none", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem", marginTop: "15px" }}>
                    Cancel & Return
                  </button>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "30px", color: "#10b981", fontSize: "0.8rem", fontWeight: "700" }}>
                    <ShieldCheck size={16} />
                    <span>SECURE TRANSACTION</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Dummy icon for NetBanking
const ArrowUpRight = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

export default PaymentModal;
