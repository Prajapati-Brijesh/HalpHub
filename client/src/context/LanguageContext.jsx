import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    home: "Home",
    services: "Services",
    community: "Community Hub",
    about: "About",
    contact: "Contact",
    login: "Login",
    signup: "Signup",
    hero_title: "The Smartest Way to Book Home Services",
    hero_subtitle: "Connecting you with top-rated local professionals for everything from plumbing to repairs.",
    search_placeholder: "Try 'I need a painter' or 'plumber'...",
    search_btn: "Search",
    plus_member: "HalpHub Plus Member",
    join_plus: "Join HalpHub Plus",
    my_bookings: "My Bookings",
    logout: "Logout",
    feat_1_title: "Verified Pros",
    feat_1_desc: "Background-checked experts only.",
    feat_2_title: "Quality Work",
    feat_2_desc: "Top-rated professionals you can trust.",
    feat_3_title: "Fast Booking",
    feat_3_desc: "Book in under 60 seconds.",
  },
  hi: {
    home: "होम",
    services: "सेवाएं",
    community: "कम्युनिटी हब",
    about: "हमारे बारे में",
    contact: "संपर्क",
    login: "लॉगिन",
    signup: "साइनअप",
    hero_title: "होम सर्विस बुक करने का सबसे स्मार्ट तरीका",
    hero_subtitle: "प्लंबिंग से लेकर रिपेयरिंग तक, टॉप-रेटेड पेशेवरों से जुड़ें।",
    search_placeholder: "कोशिश करें 'मुझे पेंटर चाहिए' या 'प्लंबर'...",
    search_btn: "खोजें",
    plus_member: "हेल्पहब प्लस सदस्य",
    join_plus: "हेल्पहब प्लस से जुड़ें",
    my_bookings: "मेरी बुकिंग",
    logout: "लॉगआउट",
    feat_1_title: "सत्यापित एक्सपर्ट्स",
    feat_1_desc: "केवल बैकग्राउंड-चेक किए गए विशेषज्ञ।",
    feat_2_title: "बेहतरीन काम",
    feat_2_desc: "भरोसेमंद और टॉप-रेटेड पेशेवर।",
    feat_3_title: "फास्ट बुकिंग",
    feat_3_desc: "60 सेकंड से भी कम समय में बुक करें।",
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  const toggleLanguage = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
