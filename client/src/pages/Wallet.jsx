import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, Zap, Shield, CreditCard } from "lucide-react";
import UPIDialog from "../components/UPIDialog";

function Wallet() {
  const [balance, setBalance] = useState(1250);
  const [coins, setCoins] = useState(450);
  const [isUPIOpen, setIsUPIOpen] = useState(false);

  const handleAddMoney = (amount) => {
    setBalance(prev => prev + Number(amount));
  };

  const transactions = [
    { id: 1, type: "out", amount: 499, title: "Home Cleaning Service", date: "Today, 2:45 PM" },
    { id: 2, type: "in", amount: 100, title: "Referral Bonus", date: "Yesterday" },
    { id: 3, type: "out", amount: 250, title: "AC Repair", date: "10 May 2026" },
    { id: 4, type: "in", amount: 1000, title: "Added to Wallet", date: "08 May 2026" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: "100px", paddingBottom: "100px" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>My Wallet</h1>
            <button onClick={() => setIsUPIOpen(true)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 25px" }}>
                <Plus size={20} /> Add Money
            </button>
        </div>
        
        <UPIDialog 
            isOpen={isUPIOpen} 
            onClose={() => setIsUPIOpen(false)} 
            amount={500} 
            onSuccess={handleAddMoney} 
        />

        {/* Balance Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "40px" }}>
            <motion.div 
                whileHover={{ y: -5 }}
                style={{ 
                    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", 
                    padding: "35px", 
                    borderRadius: "30px", 
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
            >
                <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.1 }}><WalletIcon size={150} /></div>
                <div style={{ fontSize: "0.9rem", opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Total Balance</div>
                <div style={{ fontSize: "3rem", fontWeight: "900" }}>₹{balance.toLocaleString()}</div>
                <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", background: "rgba(255,255,255,0.1)", padding: "5px 12px", borderRadius: "20px" }}>
                        <Shield size={14} color="#10b981" /> Secured
                    </div>
                </div>
            </motion.div>

            <motion.div 
                whileHover={{ y: -5 }}
                style={{ 
                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", 
                    padding: "35px", 
                    borderRadius: "30px", 
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(79, 70, 229, 0.2)"
                }}
            >
                <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.1 }}><Zap size={150} /></div>
                <div style={{ fontSize: "0.9rem", opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>HalpCoins Balance</div>
                <div style={{ fontSize: "3rem", fontWeight: "900" }}>{coins} <span style={{ fontSize: "1.2rem", fontWeight: "500" }}>HC</span></div>
                <div style={{ marginTop: "30px" }}>
                    <button style={{ background: "white", color: "var(--primary)", border: "none", padding: "8px 20px", borderRadius: "10px", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer" }}>Redeem Coins</button>
                </div>
            </motion.div>
        </div>

        {/* Transactions */}
        <div className="card" style={{ padding: "40px" }}>
            <h3 style={{ marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>Recent Transactions</h3>
            <div style={{ display: "grid", gap: "20px" }}>
                {transactions.map(tx => (
                    <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={{ 
                                width: "45px", 
                                height: "45px", 
                                borderRadius: "12px", 
                                background: tx.type === "in" ? "#f0fdf4" : "#fef2f2",
                                color: tx.type === "in" ? "#10b981" : "#ef4444",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                {tx.type === "in" ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                            </div>
                            <div>
                                <div style={{ fontWeight: "700", color: "#1e293b" }}>{tx.title}</div>
                                <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{tx.date}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: "1.1rem", fontWeight: "800", color: tx.type === "in" ? "#10b981" : "#1e293b" }}>
                            {tx.type === "in" ? "+" : "-"} ₹{tx.amount}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Payment Methods */}
        <div style={{ marginTop: "40px" }}>
            <h3 style={{ marginBottom: "20px" }}>Saved Payment Methods</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "15px", cursor: "pointer" }}>
                    <CreditCard size={24} color="#64748b" />
                    <div>
                        <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>HDFC Bank •••• 4242</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Expires 12/28</div>
                    </div>
                </div>
                <div className="card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "15px", cursor: "pointer", border: "1px dashed #cbd5e1", background: "transparent" }}>
                    <Plus size={24} color="#94a3b8" />
                    <div style={{ color: "#94a3b8", fontWeight: "600", fontSize: "0.9rem" }}>Add New Method</div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default Wallet;
