import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { sendChatMessage } from "../api";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "admin" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    try {
      const { data } = await sendChatMessage(userMessage);
      setMessages(prev => [...prev, { 
        text: data.reply, 
        sender: "admin", 
        type: data.type || 'text',
        matches: data.matches || []
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I am having trouble connecting to the server.", sender: "admin" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 3000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="card"
            style={{ 
              width: "350px", 
              height: "500px", 
              display: "flex", 
              flexDirection: "column", 
              padding: 0, 
              overflow: "hidden",
              marginBottom: "15px",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <div style={{ background: "linear-gradient(135deg, var(--primary), #6366f1)", color: "white", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Bot size={24} />
                <div>
                  <span style={{ fontWeight: "600", display: "block" }}>HelpHub AI</span>
                  <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>Online</span>
                </div>
              </div>
              <X size={20} style={{ cursor: "pointer", opacity: 0.8 }} onClick={() => setIsOpen(false)} />
            </div>

            <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", background: "#f8fafc" }}>
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  style={{ 
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    background: msg.sender === "user" ? "var(--primary)" : "white",
                    color: msg.sender === "user" ? "white" : "var(--text)",
                    padding: "12px 16px",
                    borderRadius: "16px",
                    borderBottomRightRadius: msg.sender === "user" ? "4px" : "16px",
                    borderBottomLeftRadius: msg.sender === "admin" ? "4px" : "16px",
                    maxWidth: "85%",
                    fontSize: "0.95rem",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    lineHeight: "1.4",
                    whiteSpace: "pre-line"
                  }}
                >
                  {msg.text}
                  {msg.type === 'suggestions' && (
                    <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      <button 
                        onClick={() => window.location.href = '/services'}
                        style={{ 
                          padding: "6px 12px", 
                          fontSize: "0.8rem", 
                          borderRadius: "20px", 
                          border: "1px solid var(--primary)", 
                          background: "white", 
                          color: "var(--primary)",
                          cursor: "pointer",
                          fontWeight: "600"
                        }}
                      >
                        View All Experts
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ 
                    alignSelf: "flex-start",
                    background: "white",
                    padding: "12px 16px",
                    borderRadius: "16px",
                    borderBottomLeftRadius: "4px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    display: "flex",
                    gap: "5px"
                  }}
                >
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 6, height: 6, background: "var(--primary)", borderRadius: "50%" }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, background: "var(--primary)", borderRadius: "50%" }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, background: "var(--primary)", borderRadius: "50%" }} />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ padding: "15px", background: "white", borderTop: "1px solid var(--border)", display: "flex", gap: "10px", alignItems: "center" }}>
              <input 
                placeholder="Ask me anything..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ flex: 1, fontSize: "0.95rem", padding: "12px", border: "1px solid var(--border)", borderRadius: "20px", outline: "none", background: "#f8fafc" }}
                disabled={isTyping}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ padding: "10px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px" }}
                disabled={isTyping}
              >
                <Send size={18} style={{ marginLeft: "-2px" }} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: "linear-gradient(135deg, var(--primary), #6366f1)", 
          color: "white", 
          width: "65px", 
          height: "65px", 
          borderRadius: "50%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)",
          border: "none",
          cursor: "pointer"
        }}
      >
        {isOpen ? <X size={28} /> : <Bot size={32} />}
      </motion.button>
    </div>
  );
}

export default ChatWidget;

