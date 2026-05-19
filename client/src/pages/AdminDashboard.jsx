import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  fetchAdminBookings, 
  updateBookingStatus, 
  fetchAdminUsers, 
  deleteUser, 
  fetchServices, 
  deleteService,
  addCoinsToUser
} from "../api";
import { toast } from "react-hot-toast";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Users, 
  Briefcase, 
  DollarSign, 
  Trash2,
  Bell,
  Activity,
  Shield,
  Zap,
  BarChart3,
  Server,
  UserCheck,
  LayoutDashboard,
  Settings,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      toast.error("Unauthorized: Admin access required");
      navigate('/admin/login');
      return;
    }
    loadData();
  }, []);

  // Auto-refresh users when Users tab is selected
  useEffect(() => {
    if (activeTab === 'users') {
      fetchAdminUsers().then(res => setUsers(res.data)).catch(() => {});
    }
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, usersRes, servicesRes] = await Promise.all([
        fetchAdminBookings(),
        fetchAdminUsers(),
        fetchServices()
      ]);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
      setServices(servicesRes.data);
    } catch (err) {
      toast.error("Failed to sync dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      const { data } = await fetchAdminBookings();
      setBookings(data);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleAddCoins = async (id) => {
    const amount = window.prompt("Enter amount of HalpCoins to add:");
    if (!amount || isNaN(amount) || parseInt(amount) <= 0) return;
    
    try {
        await addCoinsToUser(id, parseInt(amount));
        toast.success(`Added ${amount} coins successfully!`);
        const { data } = await fetchAdminUsers();
        setUsers(data);
    } catch (err) {
        toast.error("Failed to add coins");
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService(id);
      toast.success("Service removed");
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Stats Calculation
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);
  
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const activeProviders = users.filter(u => u.role === 'provider').length;

  const stats = [
    { title: "Total Revenue", value: `RS. ${totalRevenue.toLocaleString()}`, icon: <DollarSign />, color: "#4f46e5", trend: "+12%" },
    { title: "Total Bookings", value: bookings.length, icon: <Briefcase />, color: "#06b6d4", trend: "+5%" },
    { title: "Pending Orders", value: pendingBookings, icon: <Clock />, color: "#f59e0b", trend: "-2%" },
    { title: "Active Providers", value: activeProviders, icon: <UserCheck />, color: "#10b981", trend: "+8%" }
  ];

  const activityFeed = [
    { type: 'signup', user: 'Rahul Sharma', time: '2 mins ago', icon: <Users size={16} />, color: "#4f46e5" },
    { type: 'booking', user: 'Priya Patel', time: '15 mins ago', icon: <Briefcase size={16} />, color: "#10b981" },
    { type: 'service', user: 'Modern Plumbers', time: '1 hour ago', icon: <Settings size={16} />, color: "#f59e0b" },
    { type: 'payment', user: 'Amit Varma', time: '3 hours ago', icon: <DollarSign size={16} />, color: "#06b6d4" }
  ];

  const NavItem = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 20px",
        width: "100%",
        borderRadius: "12px",
        border: "none",
        background: activeTab === id ? "rgba(99, 102, 241, 0.1)" : "transparent",
        color: activeTab === id ? "#4f46e5" : "#64748b",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
        textAlign: "left"
      }}
    >
      {icon}
      <span style={{ fontSize: "0.95rem" }}>{label}</span>
      {activeTab === id && (
        <motion.div 
          layoutId="activePill"
          style={{ marginLeft: "auto", width: "4px", height: "20px", background: "#4f46e5", borderRadius: "2px" }}
        />
      )}
    </button>
  );

  return (
    <div style={{ display: "flex", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ 
        width: "280px", 
        background: "white", 
        borderRight: "1px solid #e2e8f0", 
        padding: "30px 20px", 
        display: "flex", 
        flexDirection: "column",
        position: "fixed",
        height: "100vh",
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px", padding: "0 10px" }}>
          <div style={{ background: "#4f46e5", color: "white", padding: "8px", borderRadius: "10px" }}>
            <Zap size={24} />
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", letterSpacing: "-0.5px" }}>HelpHub Pro</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <NavItem id="overview" label="Dashboard" icon={<LayoutDashboard size={20} />} />
          <NavItem id="bookings" label="Bookings" icon={<Briefcase size={20} />} />
          <NavItem id="users" label="Users" icon={<Users size={20} />} />
          <NavItem id="services" label="Services" icon={<Settings size={20} />} />
          <NavItem id="analytics" label="AI Insights" icon={<BarChart3 size={20} />} />
          <NavItem id="system" label="System Health" icon={<Server size={20} />} />
        </div>

        <div style={{ background: "#f1f5f9", borderRadius: "16px", padding: "20px", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <Shield size={18} color="#4f46e5" />
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1e293b" }}>Admin Security</span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>Level 4 protection active for your session.</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: "280px", padding: "40px" }}>
        {/* Top Bar */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "40px",
          background: "white",
          padding: "20px 30px",
          borderRadius: "20px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
        }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "4px" }}>Manage platform performance</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <Bell color="#64748b" />
              <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "#ef4444", width: "10px", height: "10px", borderRadius: "50%", border: "2px solid white" }}></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div>
                <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.9rem" }}>Admin User</div>
                <div style={{ color: "#64748b", fontSize: "0.75rem" }}>Super Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "20px",
          marginBottom: "30px"
        }}>
          {stats.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", margin: "0 0 4px 0" }}>{s.title}</p>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>{s.value}</h3>
              </div>
              <div style={{ 
                background: `${s.color}10`, 
                color: s.color, 
                width: "40px", 
                height: "40px", 
                borderRadius: "10px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                {s.icon}
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <div key="overview" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="card"
                style={{ padding: "30px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: "800" }}>Revenue Growth</h2>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4f46e5" }}></div>
                      <span>Actual</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#e2e8f0" }}></div>
                      <span>Projected</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ width: "100%", height: "250px", position: "relative" }}>
                  <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="200" x2="1000" y2="200" stroke="#f1f5f9" strokeWidth="1" />
                    <path d="M 0 250 L 200 220 L 400 240 L 600 180 L 800 150 L 1000 100" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 4" />
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5 }}
                      d="M 0 280 Q 150 260 250 200 T 500 150 T 750 80 T 1000 40" 
                      fill="none" 
                      stroke="#4f46e5" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", color: "#64748b", fontSize: "0.7rem", fontWeight: "600" }}>
                    <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                  </div>
                </div>

                <div style={{ marginTop: "40px", padding: "20px", background: "rgba(99, 102, 241, 0.05)", borderRadius: "16px", border: "1px dashed rgba(99, 102, 241, 0.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <Zap size={18} color="#4f46e5" />
                    <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#1e293b" }}>AI Platform Insight</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: "1.5", margin: 0 }}>
                    Revenue is up 12.4% this month. The "Home Repair" category is seeing 40% higher conversion than average.
                  </p>
                </div>
              </motion.div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="card" style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "20px" }}>Recent Activity</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {activityFeed.map((act, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px" }}>
                        <div style={{ 
                          width: "32px", 
                          height: "32px", 
                          borderRadius: "8px", 
                          background: `${act.color}15`, 
                          color: act.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {act.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#1e293b" }}>{act.user}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{act.type} registered</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: "24px", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "white" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                    <Server size={18} color="#60a5fa" />
                    <span style={{ fontWeight: "700" }}>System Health</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>API Status</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#34d399" }}>Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <motion.div 
              key="bookings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "20px", borderBottom: "1px solid #e2e8f0" }}>
                  <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "800" }}>Recent Bookings</h3>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#f8fafc" }}>
                    <tr>
                      <th style={{ padding: "16px", textAlign: "left" }}>Customer</th>
                      <th style={{ padding: "16px", textAlign: "left" }}>Service</th>
                      <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                      <th style={{ padding: "16px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px" }}>{booking.user_name || "User"}</td>
                        <td style={{ padding: "16px" }}>{booking.service_name}</td>
                        <td style={{ padding: "16px" }}>{booking.status}</td>
                        <td style={{ padding: "16px", textAlign: "right" }}>
                          <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} style={{ padding: "6px", background: "#dcfce7", color: "#166534", marginRight: "5px" }}>
                            <CheckCircle size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="card"
              style={{ padding: 0 }}
            >
              <div style={{ padding: "20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "800" }}>Registered Users</h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>Total: {users.length} users</p>
                </div>
                <button 
                  onClick={() => fetchAdminUsers().then(res => { setUsers(res.data); toast.success(`${res.data.length} users loaded!`); })}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: "600", color: "#374151" }}
                >
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#f8fafc" }}>
                  <tr>
                    <th style={{ padding: "16px", textAlign: "left" }}>User</th>
                    <th style={{ padding: "16px", textAlign: "left" }}>Role</th>
                    <th style={{ padding: "16px", textAlign: "center" }}>Coins</th>
                    <th style={{ padding: "16px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "16px" }}>{u.name}</td>
                      <td style={{ padding: "16px" }}>{u.role}</td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <span style={{ 
                          background: "#fff7ed", 
                          color: "#d97706", 
                          padding: "4px 10px", 
                          borderRadius: "15px", 
                          fontWeight: "700",
                          border: "1px solid #ffedd5",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          {u.halp_coins !== undefined ? u.halp_coins : 0}
                          <div style={{ background: "#f59e0b", width: "14px", height: "14px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.5rem", fontWeight: "800" }}>H</div>
                        </span>
                      </td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <button onClick={() => handleAddCoins(u._id)} style={{ padding: "8px 12px", background: "#fef3c7", color: "#d97706", marginRight: "10px", fontWeight: "bold", border: "1px solid #fcd34d", borderRadius: "6px", cursor: "pointer" }}>
                          + Coins
                        </button>
                        <button onClick={() => handleDeleteUser(u._id)} style={{ padding: "8px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div 
              key="services"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}
            >
              {services.map(s => (
                <div key={s._id} className="card" style={{ padding: "16px" }}>
                  <img src={s.image || "https://placehold.co/400x200"} style={{ width: "100%", height: "140px", borderRadius: "8px", objectFit: "cover" }} alt="" />
                  <h4 style={{ margin: "10px 0 5px" }}>{s.name}</h4>
                  <p style={{ color: "#4f46e5", fontWeight: "800" }}>RS. {s.price}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
              style={{ padding: "40px", textAlign: "center" }}
            >
              <Zap size={40} color="#4f46e5" style={{ margin: "0 auto 20px" }} />
              <h2>AI Insights</h2>
              <p>Platform performance is optimal. Growth is projected at +15% next month.</p>
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div 
              key="system"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
              style={{ padding: "40px" }}
            >
              <h2>System Health</h2>
              <p>All core systems are operational.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ margin: "40px -40px -40px -40px" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
