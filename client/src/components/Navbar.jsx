import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calculator, ChevronDown, LayoutGrid, Users, Menu, X, User, Mail, Shield } from "lucide-react";
import logo from "../assets/logo.png";
import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const { lang, toggleLanguage, t } = useLanguage();
  const [showTools, setShowTools] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center",
      padding: "20px 5%", 
      background: "var(--card)", 
      boxShadow: "var(--shadow)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img src={logo} alt="HelpHub Logo" style={{ height: "70px", objectFit: "contain" }} />
      </Link>

      {/* Mobile Menu Toggle */}
      <div className="show-on-mobile" style={{ display: "none" }}>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: "none", border: "none", color: "var(--text)" }}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="show-on-mobile"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{ 
        display: "flex", 
        gap: "20px", 
        alignItems: "center",
        zIndex: 1000
      }}>
        {/* Language Switcher */}
        <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "20px", padding: "4px" }}>
          <button 
            onClick={() => toggleLanguage('en')}
            style={{ padding: "4px 12px", borderRadius: "16px", border: "none", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer", background: lang === 'en' ? "var(--primary)" : "transparent", color: lang === 'en' ? "white" : "var(--text-muted)" }}
          >
            EN
          </button>
          <button 
            onClick={() => toggleLanguage('hi')}
            style={{ padding: "4px 12px", borderRadius: "16px", border: "none", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer", background: lang === 'hi' ? "var(--primary)" : "transparent", color: lang === 'hi' ? "white" : "var(--text-muted)" }}
          >
            HI
          </button>
        </div>

        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: "500" }}>{t('home')}</Link>
        <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: "500" }}>{t('services')}</Link>
        
        {user && (
          <>
            {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: "700", color: "var(--accent)" }}>Admin</Link>}
            {user.role === 'provider' && <Link to="/provider-dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: "700", color: "var(--accent)" }}>Partner with HalpHub</Link>}
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: "500" }}>{t('my_bookings')}</Link>
          </>
        )}

        {/* Tools Dropdown - Always last in the links list */}
        <div 
          className="mobile-full-width"
          style={{ position: "relative" }}
          onMouseEnter={() => setShowTools(true)}
          onMouseLeave={() => setShowTools(false)}
          onClick={() => setShowTools(!showTools)}
        >
          <button className="mobile-justify-between" style={{ 
            background: "none", border: "none", fontWeight: "500", fontSize: "1rem", 
            cursor: "pointer", color: "var(--text)", display: "flex", alignItems: "center", gap: "4px" 
          }}>
            <span>Tools</span> <ChevronDown size={16} />
          </button>
          
          {showTools && (
            <div className="dropdown-menu" style={{
              position: "absolute", top: "100%", right: 0, background: "white", 
              boxShadow: "var(--shadow-lg)", borderRadius: "12px", padding: "10px", 
              minWidth: "200px", border: "1px solid var(--border)", zIndex: 1001,
              display: "flex", flexDirection: "column", gap: "5px"
            }}>
              <Link to="/budget-estimator" onClick={() => setIsMobileMenuOpen(false)} style={{ 
                padding: "10px", borderRadius: "8px", textDecoration: "none", color: "var(--text)", 
                display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem" 
              }} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}>
                <Calculator size={16} color="var(--primary)" /> {lang === 'hi' ? 'खर्चा कैलकुलेटर' : 'AI Budget Estimator'}
              </Link>
              <Link to="/feed" onClick={() => setIsMobileMenuOpen(false)} style={{ 
                padding: "10px", borderRadius: "8px", textDecoration: "none", color: "var(--text)", 
                display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem" 
              }} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}>
                <Users size={16} color="var(--primary)" /> {t('community')}
              </Link>
            </div>
          )}
        </div>
        
        <div className="hide-on-mobile" style={{ width: "1px", height: "30px", background: "var(--border)", margin: "0 10px" }}></div>

        {user ? (
          <div className="flex-col-mobile mobile-full-width" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Link to="/wallet" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", background: "#fff7ed", padding: "4px 10px", borderRadius: "15px", border: "1px solid #ffedd5" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#d97706" }}>{user.halp_coins}</span>
              <div style={{ background: "#f59e0b", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.6rem", fontWeight: "800" }}>H</div>
            </Link>
            {user.is_plus && (
              <div style={{ background: "gold", color: "#b45309", padding: "4px 10px", borderRadius: "15px", fontSize: "0.85rem", fontWeight: "700" }}>PLUS</div>
            )}

            {/* Action Buttons */}
            {user.role === 'provider' && (
              <Link to="/create-post" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary" style={{ padding: "8px 18px", background: "#10b981", display: "flex", alignItems: "center", gap: "6px", borderRadius: "20px", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                + Post Ad
              </Link>
            )}

            {/* Elegant Profile Toggle */}
            <div className="mobile-full-width" style={{ position: "relative" }}>
              <button 
                className="mobile-justify-between"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{
                  background: "none",
                  border: "none",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  backgroundColor: "#f1f5f9",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e2e8f0"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#f1f5f9"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "800"
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span>{user.name}</span>
                </div>
                <ChevronDown size={14} style={{ transform: showProfileDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>

              {showProfileDropdown && (
                <div className="dropdown-menu" style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  background: "white",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  borderRadius: "16px",
                  padding: "20px",
                  minWidth: "260px",
                  border: "1px solid var(--border)",
                  zIndex: 1050,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  animation: "fadeIn 0.2s ease-out"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "var(--primary-light)",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      fontWeight: "800"
                    }}>
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.95rem" }}>{user.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <Shield size={12} color="var(--primary)" />
                        <span style={{ fontSize: "0.75rem", textTransform: "capitalize", color: "var(--text-muted)", fontWeight: "600" }}>{user.role}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text)", fontSize: "0.85rem", padding: "4px 0" }}>
                    <Mail size={16} style={{ color: "var(--text-muted)" }} />
                    <span style={{ wordBreak: "break-all", fontWeight: "500" }}>{user.email}</span>
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleLogout} className="btn-primary" style={{ padding: "8px 16px" }}>{t('logout')}</button>
          </div>
        ) : (
          <div className="flex-col-mobile mobile-full-width" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: "500" }}>{t('login')}</Link>
            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary" style={{ padding: "8px 20px", textAlign: "center", width: "100%", boxSizing: "border-box" }}>{t('signup')}</Link>
          </div>
        )}
      </div>

      {/* Adding inline styles for mobile menu behavior just for Navbar */}
      <style>{`
        .nav-links a, .nav-links button {
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--card);
            padding: 20px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            align-items: flex-start !important;
            border-top: 1px solid var(--border);
            max-height: calc(100vh - 70px);
            overflow-y: auto;
          }
          .nav-links.mobile-open {
            display: flex !important;
            gap: 15px !important;
          }
          .dropdown-menu {
            position: static !important;
            box-shadow: none !important;
            border: none !important;
            padding: 10px 0 5px 10px !important;
            width: 100% !important;
            min-width: auto !important;
            background: transparent !important;
          }
          .mobile-full-width {
            width: 100%;
          }
          .mobile-justify-between {
            justify-content: space-between !important;
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
