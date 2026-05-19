import React, { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { Heart, Briefcase, Mail, Video, Zap, Crown, Users, Trash2, Brain, Phone, MessageCircle } from "lucide-react";
import { fetchUserBookings, fetchServices, verifyWork, upgradeMembership, deleteBooking } from "../api";
import VisualRoadmap from "../components/VisualRoadmap";
import toast from "react-hot-toast";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [favServices, setFavServices] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings");
  const [loading, setLoading] = useState(true);
  const [refInput, setRefInput] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const handleUpgrade = async () => {
    try {
      const { data } = await upgradeMembership();
      user.is_plus = true;
      localStorage.setItem('user', JSON.stringify(user));
      alert(data.message);
      window.location.reload();
    } catch (error) {
      alert("Upgrade failed");
    }
  };

  const handleClaimReferral = async () => {
    if (!refInput) return;
    setClaiming(true);
    try {
      const { data } = await claimReferral(refInput);
      toast.success(data.message);
      // Update local coins
      user.halp_coins += 50;
      localStorage.setItem('user', JSON.stringify(user));
      setRefInput("");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to claim code");
    } finally {
      setClaiming(false);
    }
  };
  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await deleteBooking(id);
      setBookings(bookings.filter(b => b._id !== id));
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  useEffect(() => {
    const getBookings = async () => {
      try {
        const { data } = await fetchUserBookings();
        setBookings(data);

        // Fetch favorites
        const { data: allServices } = await fetchServices();
        setFavServices(allServices.filter(s => user.favorites?.includes(s._id)));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, [user.favorites]);

  if (!user) return <div className="container" style={{ padding: "100px", textAlign: "center" }}>Please login to view dashboard</div>;

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      {/* Header / Profile Header */}
      <div className="card flex-col-mobile" style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "40px", padding: "30px", position: "relative" }}>
        <div>
          <h1 style={{ marginBottom: "5px" }}>{user.name}</h1>
          <p style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
            <Mail size={16} /> {user.email}
          </p>
          <span style={{ display: "inline-block", marginTop: "10px", padding: "4px 12px", background: "var(--primary)", color: "white", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase" }}>
            {user.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "20px", borderBottom: "1px solid var(--border)", marginBottom: "30px", overflowX: "auto", whiteSpace: "nowrap", paddingBottom: "5px" }}>
        <button
          onClick={() => setActiveTab("bookings")}
          style={{ padding: "12px 24px", background: "none", border: "none", borderBottom: activeTab === 'bookings' ? "3px solid var(--primary)" : "3px solid transparent", color: activeTab === 'bookings' ? "var(--primary)" : "var(--text-muted)", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Briefcase size={18} /> My Bookings
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          style={{ padding: "12px 24px", background: "none", border: "none", borderBottom: activeTab === 'favorites' ? "3px solid var(--primary)" : "3px solid transparent", color: activeTab === 'favorites' ? "var(--primary)" : "var(--text-muted)", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Heart size={18} /> Favorites
        </button>
        <button
          onClick={() => setActiveTab("subscription")}
          style={{ padding: "12px 24px", background: "none", border: "none", borderBottom: activeTab === 'subscription' ? "3px solid var(--primary)" : "3px solid transparent", color: activeTab === 'subscription' ? "var(--primary)" : "var(--text-muted)", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Zap size={18} /> HalpHub Plus
        </button>
        <button
          onClick={() => setActiveTab("referral")}
          style={{ padding: "12px 24px", background: "none", border: "none", borderBottom: activeTab === 'referral' ? "3px solid var(--primary)" : "3px solid transparent", color: activeTab === 'referral' ? "var(--primary)" : "var(--text-muted)", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Users size={18} /> Refer & Earn
        </button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div style={{ minHeight: "300px" }}>
          {activeTab === 'bookings' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {bookings.map((booking) => (
                <div key={booking._id} className="card" style={{ padding: "0", overflow: "hidden" }}>
                  <div className="flex-col-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", marginBottom: "5px" }}>{booking.service_name}</h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>📍 {booking.address}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>📅 {new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        textTransform: "capitalize",
                        background: booking.status === 'pending' ? "#fef3c7" : (booking.status === 'accepted' ? "#dcfce7" : "#fee2e2"),
                        color: booking.status === 'pending' ? "#92400e" : (booking.status === 'accepted' ? "#166534" : "#991b1b")
                      }}>
                        {booking.status}
                      </span>
                      <p style={{ marginTop: "8px", fontWeight: "700" }}>₹{booking.price}</p>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            style={{ padding: "8px", background: "#fee2e2", border: "none", borderRadius: "8px", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontWeight: "700", fontSize: "0.8rem" }}
                          >
                            <Trash2 size={14} /> Cancel
                          </button>
                        )}
                        <a 
                          href={`tel:+919313116750`}
                          style={{ padding: "8px 12px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px", background: "#f1f5f9", color: "#1e293b", textDecoration: "none", borderRadius: "8px", fontWeight: "600" }}
                        >
                          <Phone size={14} /> Call
                        </a>
                        <a 
                          href={`https://wa.me/919313116750?text=Hi, I am contacting about my booking for ${booking.service_name}.`} target="_blank" rel="noreferrer"
                          style={{ padding: "8px 12px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px", background: "#dcfce7", color: "#166534", textDecoration: "none", borderRadius: "8px", fontWeight: "600" }}
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </a>
                        <button
                          className="btn-primary"
                          style={{ padding: "8px 12px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px", background: "var(--accent)" }}
                          onClick={() => window.location.href = '/meeting'}
                        >
                          <Video size={14} /> Video Call
                        </button>
                      </div>

                      {booking.verification?.status === 'verified' ? (
                        <div style={{ marginTop: "10px", padding: "8px", background: "#ecfdf5", borderRadius: "8px", border: "1px solid #10b981", textAlign: "left" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#166534", fontWeight: "700", fontSize: "0.75rem", marginBottom: "4px" }}>
                            <Brain size={14} /> AI VERIFIED ({booking.verification.score}%)
                          </div>
                          <p style={{ fontSize: "0.7rem", color: "#166534", margin: 0, lineHeight: "1.4" }}>{booking.verification.report}</p>
                        </div>
                      ) : (
                        <button
                          className="btn-primary"
                          style={{ marginTop: "8px", padding: "6px 12px", fontSize: "0.8rem", background: "white", color: "var(--primary)", border: "1px solid var(--primary)" }}
                          onClick={() => {
                            alert("Waiting for provider to upload proof of work for AI analysis.");
                          }}
                        >
                          Verify Quality (AI)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Visual Roadmap Section */}
                  <div style={{ padding: "0 20px 20px 20px", borderTop: "1px solid #f1f5f9", background: "#f8fafc" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--primary)" }}>PROJECT ROADMAP</span>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Live Status Tracking</span>
                    </div>
                    <VisualRoadmap milestones={booking.milestones} />
                  </div>
                </div>
              ))}
              {bookings.length === 0 && <p style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No bookings yet.</p>}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {favServices.map(service => (
                <ServiceCard key={service._id} service={service} />
              ))}
              {favServices.length === 0 && <p style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No favorite services yet.</p>}
            </div>
          )}
          {activeTab === 'subscription' && (
            <div className="card" style={{ padding: "40px", textAlign: "center", background: user.is_plus ? "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)" : "white" }}>
              {user.is_plus ? (
                <>
                  <Crown size={60} style={{ color: "#d97706", marginBottom: "20px" }} />
                  <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>You are a Plus Member!</h2>
                  <p style={{ color: "#92400e", marginBottom: "30px" }}>Enjoy 0% service fees and priority support on every booking.</p>
                  <div className="responsive-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", textAlign: "left" }}>
                    <div className="card" style={{ background: "white" }}>
                      <h4 style={{ color: "var(--primary)" }}>✓ Zero Fees</h4>
                      <p style={{ fontSize: "0.85rem" }}>You save ₹50-₹200 on every booking.</p>
                    </div>
                    <div className="card" style={{ background: "white" }}>
                      <h4 style={{ color: "var(--primary)" }}>✓ Priority Support</h4>
                      <p style={{ fontSize: "0.85rem" }}>Average response time: 5 minutes.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Zap size={60} style={{ color: "var(--primary)", marginBottom: "20px" }} />
                  <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>Upgrade to HalpHub Plus</h2>
                  <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>Unlock exclusive benefits and save more on every service.</p>
                  <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                    <ul style={{ textAlign: "left", marginBottom: "30px", listStyle: "none", padding: 0 }}>
                      <li style={{ marginBottom: "10px" }}>✅ <strong>₹0 Service Fees</strong> (Save on every booking)</li>
                      <li style={{ marginBottom: "10px" }}>✅ <strong>Priority Matching</strong> (Get the best experts faster)</li>
                      <li style={{ marginBottom: "10px" }}>✅ <strong>Free Consultations</strong> (Up to 3 calls/month)</li>
                    </ul>
                    <button className="btn-primary" style={{ width: "100%", padding: "15px", fontSize: "1.1rem" }} onClick={handleUpgrade}>
                      Unlock for ₹199/month
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === 'referral' && (
            <div className="card" style={{ padding: "40px", textAlign: "center" }}>
              <Users size={60} style={{ color: "var(--primary)", marginBottom: "20px" }} />
              <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>Refer & Earn ₹100</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>Share your unique code with friends and get credits when they book their first service.</p>

              <div className="responsive-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }}>
                {/* Your Code */}
                <div className="card" style={{ padding: "24px", background: "#f8fafc" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b", marginBottom: "10px" }}>YOUR REFERRAL CODE</p>
                  <div style={{
                    background: "white",
                    padding: "15px",
                    borderRadius: "12px",
                    border: "2px dashed var(--primary)",
                    marginBottom: "15px"
                  }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "2px", color: "var(--primary)" }}>
                      {user.referral_code || "HUB12345"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn-primary" style={{ flex: 1, padding: "10px" }} onClick={() => {
                      navigator.clipboard.writeText(user.referral_code || "HUB12345");
                      toast.success("Code copied!");
                    }}>Copy</button>
                    <button className="btn-primary" style={{ flex: 1, padding: "10px", background: "#25d366" }} onClick={() => {
                      window.open(`https://wa.me/?text=Use my code ${user.referral_code || "HUB12345"} to get ₹100 off on HalpHub!`, '_blank');
                    }}>WhatsApp</button>
                  </div>
                </div>

                {/* Claim Code */}
                <div className="card" style={{ padding: "24px", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b", marginBottom: "10px" }}>HAVE A REFERRAL CODE?</p>
                  <input
                    placeholder="Enter Code"
                    value={refInput}
                    onChange={(e) => setRefInput(e.target.value)}
                    style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "15px", textAlign: "center", fontSize: "1.1rem", fontWeight: "700", textTransform: "uppercase" }}
                  />
                  <button
                    className="btn-primary"
                    style={{ width: "100%", padding: "12px" }}
                    disabled={claiming}
                    onClick={handleClaimReferral}
                  >
                    {claiming ? "Claiming..." : "Claim Reward"}
                  </button>
                </div>
              </div>

              <div style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
                <h4 style={{ marginBottom: "15px" }}>How it works:</h4>
                <div className="responsive-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontWeight: "800" }}>1</div>
                    <p style={{ fontSize: "0.85rem" }}>Share your unique code.</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontWeight: "800" }}>2</div>
                    <p style={{ fontSize: "0.85rem" }}>Friend signs up & claims.</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontWeight: "800" }}>3</div>
                    <p style={{ fontSize: "0.85rem" }}>You both get HalpCoins!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
