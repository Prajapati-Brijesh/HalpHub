import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function SmartSearch({ onSearch, isHero = false }) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice search is not supported in your browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      // Automatically search
      if (onSearch) onSearch(transcript);
      else navigate(`/services?q=${encodeURIComponent(transcript)}`);
    };
    recognition.start();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      // If used in Hero section, navigate to Services with query param
      navigate(`/services?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSearch}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ 
        display: "flex", 
        gap: "10px", 
        maxWidth: isHero ? "600px" : "100%", 
        margin: isHero ? "0 auto" : "0",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        padding: "8px",
        borderRadius: "24px",
        boxShadow: "0 10px 30px rgba(99, 102, 241, 0.2)",
        border: "1px solid rgba(99, 102, 241, 0.3)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Glow effect */}
      <div style={{
        position: "absolute",
        top: 0, left: "-100%", right: 0, bottom: 0,
        background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent)",
        animation: "shimmer 3s infinite",
        zIndex: 0,
        pointerEvents: "none"
      }} />

      <style>
        {`
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}
      </style>

      <div style={{ display: "flex", alignItems: "center", paddingLeft: "15px", zIndex: 1, color: "var(--primary)" }}>
        <Sparkles size={20} />
      </div>
      
      <input 
        placeholder={t('search_placeholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ 
          border: "none", 
          flex: 1, 
          padding: "12px 10px", 
          fontSize: "1rem",
          background: "transparent",
          outline: "none",
          color: "var(--text)",
          zIndex: 1
        }}
      />
      
      <button 
        type="button"
        onClick={startVoiceSearch}
        style={{
          border: "none",
          background: isListening ? "#ef4444" : "transparent",
          color: isListening ? "white" : "var(--primary)",
          borderRadius: "50%",
          width: "45px",
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 1,
          transition: "all 0.3s ease"
        }}
      >
        {isListening ? <MicOff size={20} className="pulse" /> : <Mic size={20} />}
      </button>

      <button 
        type="submit" 
        className="btn-primary" 
        style={{ 
          padding: "12px 30px", 
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 1
        }}
      >
        <Search size={18} />
        <span style={{ display: isHero ? "inline" : "none" }}>{t('search_btn')}</span>
      </button>
    </motion.form>
  );
}

export default SmartSearch;
