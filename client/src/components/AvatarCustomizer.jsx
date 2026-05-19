import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { updateAvatar } from '../api';
import toast from 'react-hot-toast';

const avatarStyles = {
  top: ['shortHair', 'longHair', 'hat', 'hijab', 'turban', 'winterHat2', 'winterHat3'],
  accessories: ['blank', 'kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers'],
  clothing: ['blazerAndShirt', 'blazerAndSweater', 'collarAndSweater', 'graphicShirt', 'hoodie', 'overall', 'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck'],
  skinColor: ['tanned', 'yellow', 'pale', 'light', 'brown', 'darkBrown', 'black'],
  hairColor: ['auburn', 'black', 'blonde', 'blondeGolden', 'brown', 'brownDark', 'pastelPink', 'platinum', 'red', 'silverGray'],
  clothingColor: ['black', 'blue01', 'blue02', 'blue03', 'gray01', 'gray02', 'heather', 'pastelBlue', 'pastelGreen', 'pastelOrange', 'pastelRed', 'pastelYellow', 'pink', 'red', 'white']
};

const AvatarCustomizer = ({ isOpen, onClose, currentAvatar, onSaveSuccess }) => {
  const [options, setOptions] = useState({
    top: 'shortHair',
    accessories: 'blank',
    clothing: 'shirtCrewNeck',
    skinColor: 'light',
    hairColor: 'brown',
    clothingColor: 'blue01'
  });
  const [loading, setLoading] = useState(false);

  // Try to parse existing avatar URL to initialize options
  useEffect(() => {
    if (currentAvatar && currentAvatar.includes('api.dicebear.com/7.x/avataaars/svg')) {
      try {
        const urlParams = new URLSearchParams(currentAvatar.split('?')[1]);
        const initOptions = { ...options };
        Object.keys(avatarStyles).forEach(key => {
          if (urlParams.has(key)) {
             const val = urlParams.get(key).split(',')[0]; // taking first if multiple
             if(avatarStyles[key].includes(val)) {
                initOptions[key] = val;
             }
          }
        });
        setOptions(initOptions);
      } catch (e) {
        console.error("Failed to parse avatar URL", e);
      }
    }
  }, [currentAvatar]);

  const generateUrl = () => {
    let url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${JSON.parse(localStorage.getItem('user'))?.name || 'User'}`;
    Object.keys(options).forEach(key => {
      if (options[key]) {
        url += `&${key}=${options[key]}`;
      }
    });
    // Add default values for things we don't customize to make it look good
    url += '&mouth=smile&eyes=default&eyebrows=default';
    return url;
  };

  const handleSave = async () => {
    setLoading(true);
    const newAvatarUrl = generateUrl();
    try {
      await updateAvatar(newAvatarUrl);
      
      // Update local storage
      const user = JSON.parse(localStorage.getItem('user'));
      user.avatar = newAvatarUrl;
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success("Avatar updated successfully!");
      onSaveSuccess(newAvatarUrl);
      onClose();
    } catch (err) {
      toast.error("Failed to save avatar.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentPreviewUrl = generateUrl();

  return (
    <AnimatePresence>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{ background: "white", padding: "30px", borderRadius: "20px", width: "90%", maxWidth: "800px", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px", position: "relative" }}
        >
          <button onClick={onClose} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
            <X size={24} />
          </button>

          {/* Left Preview Side */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "800", color: "#1e293b" }}>Preview</h2>
            <div style={{ background: "#f8fafc", width: "100%", aspectRatio: "1", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #e2e8f0" }}>
              <img src={currentPreviewUrl} alt="Avatar Preview" style={{ width: "80%", height: "80%" }} />
            </div>
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="btn-primary" 
              style={{ width: "100%", padding: "12px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontWeight: "700" }}
            >
              {loading ? "Saving..." : <><Check size={18} /> Save Avatar</>}
            </button>
          </div>

          {/* Right Controls Side */}
          <div style={{ overflowY: "auto", maxHeight: "60vh", paddingRight: "10px" }}>
            <h2 style={{ margin: "0 0 20px 0", fontSize: "1.2rem", fontWeight: "800", color: "#1e293b" }}>Customization</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {Object.keys(avatarStyles).map(category => (
                <div key={category}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {avatarStyles[category].map(option => (
                      <button
                        key={option}
                        onClick={() => setOptions({ ...options, [category]: option })}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          border: options[category] === option ? "2px solid var(--primary)" : "1px solid #e2e8f0",
                          background: options[category] === option ? "var(--primary)" : "white",
                          color: options[category] === option ? "white" : "#475569",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {option.replace(/([A-Z])/g, ' $1').trim()}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AvatarCustomizer;
