import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Mic, X, Sparkles, Send, Bot, User } from "lucide-react";

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I am your HalpHub AI. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Simulated AI response
    setTimeout(() => {
        let response = "I'm analyzing your request. We have 12 professional experts available for this in your area.";
        if (input.toLowerCase().includes("plumber")) response = "I found 3 Top-Rated Plumbers nearby. Would you like me to book the nearest one for you?";
        if (input.toLowerCase().includes("price")) response = "Our services start from ₹499. You can use your HalpCoins for a 20% discount!";
        
        setMessages([...newMessages, { role: "bot", text: response }]);
        setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          color: "white",
          border: "none",
          boxShadow: "0 10px 25px rgba(79, 70, 229, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 1000
        }}
      >
        <Sparkles size={30} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            style={{
              position: "fixed",
              bottom: "110px",
              right: "30px",
              width: "380px",
              height: "550px",
              background: "white",
              borderRadius: "24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 1001,
              border: "1px solid #f1f5f9"
            }}
          >
            {/* Header */}
            <div style={{ background: "#1e293b", padding: "20px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ background: "rgba(255,255,255,0.1)", p: "8px", borderRadius: "10px" }}><Bot size={20} /></div>
                <div>
                    <div style={{ fontWeight: "700", fontSize: "1rem" }}>HalpHub AI Assistant</div>
                    <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>Powered by GPT-4</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><X size={20} /></button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px", background: "#f8fafc" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ 
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    padding: "12px 16px",
                    borderRadius: msg.role === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                    background: msg.role === "user" ? "var(--primary)" : "white",
                    color: msg.role === "user" ? "white" : "#1e293b",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    fontSize: "0.9rem",
                    lineHeight: "1.5"
                }}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ background: "white", padding: "10px 15px", borderRadius: "15px", width: "fit-content", fontSize: "0.8rem", color: "#64748b" }}>
                    AI is thinking...
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: "20px", background: "white", borderTop: "1px solid #f1f5f9", display: "flex", gap: "10px" }}>
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.9rem" }}
              />
              <button 
                onClick={handleSend}
                style={{ background: "var(--primary)", color: "white", border: "none", width: "45px", height: "45px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIAssistant;
