import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, Settings, Layout } from "lucide-react";

function MeetingRoom() {
  const [isJoined, setIsJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [transcript, setTranscript] = useState([
    { user: "System", text: "Meeting started at " + new Date().toLocaleTimeString() },
    { user: "Client", text: "Hi, I wanted to discuss the plumbing layout for the kitchen." },
    { user: "Expert", text: "Sure, let's look at the blueprints. I'll need to move the sink slightly to the left." }
  ]);
  const [summary, setSummary] = useState("");

  const handleEndCall = () => {
    setIsJoined(false);
    setSummary("AI Summary: 1. Discussed kitchen plumbing layout. 2. Expert suggested moving the sink left. 3. Client approved. Next step: Finalize blueprints by Friday.");
  };

  return (
    <div className="container" style={{ padding: "40px 20px", minHeight: "90vh", background: "#0f172a", color: "white", borderRadius: "20px", marginTop: "20px" }}>
      {!isJoined && !summary ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <Video size={80} style={{ color: "var(--primary)", marginBottom: "20px" }} />
          <h1>Join Video Consultation</h1>
          <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Secure, encrypted video call with your expert</p>
          <button className="btn-primary" style={{ padding: "12px 40px", fontSize: "1.1rem" }} onClick={() => setIsJoined(true)}>Join Now</button>
        </div>
      ) : isJoined ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "20px", height: "80vh" }}>
          {/* Main Video Area */}
          <div style={{ position: "relative", background: "#1e293b", borderRadius: "16px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
             <img 
               src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
               alt="Expert" 
               style={{ width: "100%", height: "100%", objectFit: "cover" }} 
             />
             <div style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(0,0,0,0.5)", padding: "4px 12px", borderRadius: "8px", fontSize: "0.8rem" }}>Expert - Live</div>
             
             {/* Small self video */}
             <div style={{ position: "absolute", bottom: "100px", right: "20px", width: "180px", height: "120px", background: "#334155", borderRadius: "12px", border: "2px solid var(--primary)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: "700" }}>You</span>
             </div>

             {/* Controls */}
             <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "15px", background: "rgba(0,0,0,0.7)", padding: "12px 25px", borderRadius: "40px" }}>
                <button onClick={() => setMicOn(!micOn)} style={{ background: micOn ? "#334155" : "#ef4444", border: "none", color: "white", width: "45px", height: "45px", borderRadius: "50%", cursor: "pointer" }}>
                  {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
                <button onClick={() => setVideoOn(!videoOn)} style={{ background: videoOn ? "#334155" : "#ef4444", border: "none", color: "white", width: "45px", height: "45px", borderRadius: "50%", cursor: "pointer" }}>
                  {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>
                <button onClick={handleEndCall} style={{ background: "#ef4444", border: "none", color: "white", width: "45px", height: "45px", borderRadius: "50%", cursor: "pointer" }}>
                  <PhoneOff size={20} />
                </button>
             </div>
          </div>

          {/* Sidebar Area */}
          <div style={{ background: "#1e293b", borderRadius: "16px", display: "flex", flexDirection: "column", padding: "20px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
               <button style={{ flex: 1, background: "var(--primary)", border: "none", color: "white", padding: "8px", borderRadius: "8px", fontSize: "0.85rem" }}>Live Transcript</button>
               <button style={{ flex: 1, background: "transparent", border: "1px solid #334155", color: "#94a3b8", padding: "8px", borderRadius: "8px", fontSize: "0.85rem" }}>Participants</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
              {transcript.map((t, i) => (
                <div key={i}>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--primary)", display: "block" }}>{t.user}</span>
                  <p style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>{t.text}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
               <input placeholder="Type a message..." style={{ flex: 1, background: "#0f172a", border: "none", padding: "10px", borderRadius: "8px", color: "white" }} />
               <button style={{ background: "var(--primary)", border: "none", color: "white", padding: "10px", borderRadius: "8px" }}>
                 <MessageSquare size={18} />
               </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px" }}>
           <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
             <PhoneOff size={60} style={{ color: "#ef4444", marginBottom: "20px" }} />
             <h1 style={{ marginBottom: "30px" }}>Call Ended</h1>
             <div className="card" style={{ background: "#1e293b", border: "1px solid var(--primary)", textAlign: "left", maxWidth: "600px", margin: "0 auto", color: "white" }}>
                <h3 style={{ color: "var(--primary)", marginBottom: "15px" }}>AI Meeting Summary</h3>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>{summary}</p>
                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                  <button className="btn-primary" style={{ flex: 1 }}>Save to Project</button>
                  <button className="btn-primary" style={{ flex: 1, background: "transparent", border: "1px solid white" }} onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</button>
                </div>
             </div>
           </motion.div>
        </div>
      )}
    </div>
  );
}

export default MeetingRoom;
