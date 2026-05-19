import React, { useState, useEffect } from "react";
import { fetchProviderBookings, updateBookingStatus, verifyWork, fetchProviderServices, createService, createFeedPost } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  User, 
  MapPin, 
  DollarSign, 
  Star, 
  CheckSquare, 
  ArrowUpRight,
  TrendingUp,
  Briefcase,
  History,
  CreditCard,
  ExternalLink,
  Camera,
  Brain,
  X,
  Phone,
  MessageCircle
} from "lucide-react";
import toast from "react-hot-toast";

function ProviderDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [verifyingJob, setVerifyingJob] = useState(null);
  const [verifyPhotos, setVerifyPhotos] = useState({ before: "", after: "" });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [myServices, setMyServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ title: "", category: "", price: "", description: "", location: "" });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ content: "", image: "" });

  useEffect(() => {
    loadBookings();
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data } = await fetchProviderServices();
      setMyServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBookings = async () => {
    try {
      const { data } = await fetchProviderBookings();
      setBookings(data);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Job marked as ${status}`);
      loadBookings();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleVerify = async () => {
    if (!verifyPhotos.before || !verifyPhotos.after) {
        return toast.error("Please provide both Before and After photos");
    }
    setIsAnalyzing(true);
    try {
        const { data } = await verifyWork({
            booking_id: verifyingJob._id,
            before_photo: verifyPhotos.before,
            after_photo: verifyPhotos.after
        });
        toast.success("Quality Verified by AI!");
        setVerifyingJob(null);
        setVerifyPhotos({ before: "", after: "" });
        loadBookings();
    } catch (err) {
        toast.error("AI Analysis failed");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
        const res = await createService(newService);
        toast.success("Service listed successfully! 50 Coins deducted.");
        setShowAddService(false);
        setNewService({ title: "", category: "", price: "", description: "", location: "" });
        
        const user = JSON.parse(localStorage.getItem('user'));
        if (res.data.new_balance !== undefined && user) {
            user.halp_coins = res.data.new_balance;
            localStorage.setItem('user', JSON.stringify(user));
        }
        
        loadServices();
        window.location.reload();
    } catch (err) {
        if (err.response?.status === 400 && err.response?.data?.message) {
            toast.error(err.response.data.message, { duration: 5000 });
        } else {
            toast.error("Failed to list service");
        }
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.content) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await createFeedPost({
        ...newPost,
        userName: user.name,
        userAvatar: user.avatar,
        likes: 0
      });
      toast.success("Update shared to the community feed!");
      setNewPost({ content: "", image: "" });
      setShowCreatePost(false);
    } catch (err) {
      toast.error("Failed to post update");
    }
  };

  // Analytics Calculations
  const totalEarnings = bookings
    .filter(b => b.status === 'accepted' || b.status === 'completed')
    .reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);
  
  const pendingRequests = bookings.filter(b => b.status === 'pending');
  const activeJobs = bookings.filter(b => b.status === 'accepted');
  const historyJobs = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected');

  const stats = [
    { label: "Total Earnings", value: `₹${totalEarnings.toLocaleString()}`, icon: <DollarSign />, color: "#4f46e5", trend: "+15%" },
    { label: "Active Jobs", value: activeJobs.length, icon: <Briefcase />, color: "#06b6d4", trend: "+2" },
    { label: "Job Rating", value: "4.9", icon: <Star />, color: "#f59e0b", trend: "Top 5%" },
    { label: "Completion", value: "98%", icon: <CheckSquare />, color: "#10b981", trend: "Perfect" }
  ];

  if (loading) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{ width: "40px", height: "40px", border: "4px solid #e2e8f0", borderTopColor: "var(--primary)", borderRadius: "50%" }}
      />
    </div>
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "40px 0", marginBottom: "40px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>Provider Workspace</h1>
              <p style={{ color: "#64748b", marginTop: "5px" }}>Manage your professional services and earnings.</p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button 
                className="btn-primary" 
                style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "30px", padding: "10px 20px" }}
                onClick={() => setShowCreatePost(true)}
              >
                <MessageCircle size={18} /> Share Update
              </button>
              <div style={{ textAlign: "right", marginLeft: "10px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#10b981", textTransform: "uppercase", letterSpacing: "1px" }}>Available</div>
                <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Updated just now</div>
              </div>
              <div style={{ width: "12px", height: "12px", background: "#10b981", borderRadius: "50%", marginTop: "5px" }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gap: "24px",
          marginBottom: "40px"
        }}>
          {stats.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{ padding: "24px", display: "flex", justifyContent: "space-between", position: "relative", overflow: "hidden" }}
            >
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#64748b", margin: "0 0 8px 0" }}>{s.label}</p>
                <h3 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>{s.value}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px", color: "#10b981", fontSize: "0.75rem", fontWeight: "700" }}>
                  <TrendingUp size={14} />
                  <span>{s.trend}</span>
                </div>
              </div>
              <div style={{ 
                background: `${s.color}15`, 
                color: s.color, 
                width: "48px", 
                height: "48px", 
                borderRadius: "12px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                {s.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "30px", background: "#f1f5f9", padding: "6px", borderRadius: "12px", width: "fit-content", maxWidth: "100%", overflowX: "auto", whiteSpace: "nowrap" }}>
          {[
              { id: "active", label: "Active Jobs", count: activeJobs.length, icon: <Briefcase size={18} /> },
              { id: "new", label: "New Requests", count: pendingRequests.length, icon: <Clock size={18} /> },
              { id: "services", label: "My Services", count: myServices.length, icon: <Star size={18} /> },
              { id: "history", label: "History", count: null, icon: <History size={18} /> },
              { id: "payments", label: "Payments", count: null, icon: <CreditCard size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                background: activeTab === tab.id ? "white" : "transparent",
                color: activeTab === tab.id ? "#1e293b" : "#64748b",
                fontWeight: "600",
                boxShadow: activeTab === tab.id ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.count > 0 && (
                <span style={{ background: "var(--primary)", color: "white", fontSize: "0.7rem", padding: "2px 6px", borderRadius: "10px" }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            style={{ display: "grid", gap: "20px" }}
          >
            {activeTab === 'active' && (
              activeJobs.length === 0 ? <EmptyState icon={<Briefcase size={40} />} text="No active jobs. Look for new requests!" /> :
              activeJobs.map(job => <JobCard key={job._id} job={job} type="active" onUpdate={handleStatusUpdate} onVerify={() => setVerifyingJob(job)} />)
            )}

            {activeTab === 'new' && (
              pendingRequests.length === 0 ? <EmptyState icon={<Clock size={40} />} text="All caught up! No new requests." /> :
              pendingRequests.map(job => <JobCard key={job._id} job={job} type="new" onUpdate={handleStatusUpdate} />)
            )}

            {activeTab === 'history' && (
              historyJobs.length === 0 ? <EmptyState icon={<History size={40} />} text="No project history yet." /> :
              historyJobs.map(job => <JobCard key={job._id} job={job} type="history" />)
            )}

            {activeTab === 'services' && (
              <div style={{ display: "grid", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>Active Listings</h2>
                    <button className="btn-primary" onClick={() => setShowAddService(true)}>+ List New Service</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
                    {myServices.map(service => (
                        <div key={service._id} className="card" style={{ padding: "0", overflow: "hidden" }}>
                            <img src={service.image} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                            <div style={{ padding: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                                    <h4 style={{ margin: 0 }}>{service.title}</h4>
                                    <span style={{ fontWeight: "800", color: "var(--primary)" }}>₹{service.price}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#64748b", fontSize: "0.85rem", marginBottom: "15px" }}>
                                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> {service.rating} ({service.reviews} reviews)
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button style={{ flex: 1, padding: "8px", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.85rem" }}>Edit</button>
                                    <button style={{ flex: 1, padding: "8px", background: "white", border: "1px solid #fee2e2", color: "#ef4444", borderRadius: "8px", fontSize: "0.85rem" }}>Pause</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {myServices.length === 0 && <EmptyState icon={<Star size={40} />} text="You haven't listed any services yet." />}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="card" style={{ padding: "40px", textAlign: "center" }}>
                <CreditCard size={48} style={{ color: "#94a3b8", marginBottom: "20px" }} />
                <h3>Payments Breakdown</h3>
                <p style={{ color: "#64748b", maxWidth: "400px", margin: "10px auto" }}>Detailed earnings reports and withdrawal options will be available here soon.</p>
                <div style={{ marginTop: "30px", fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>₹{totalEarnings.toLocaleString()}</div>
                <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Current Balance</div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Service Modal */}
      <AnimatePresence>
        {showAddService && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="card" 
                    style={{ width: "100%", maxWidth: "500px", padding: "40px", background: "white" }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                        <h2 style={{ margin: 0 }}>List New Service</h2>
                        <button onClick={() => setShowAddService(false)} style={{ border: "none", background: "none", cursor: "pointer" }}><X /></button>
                    </div>

                    <form onSubmit={handleAddService}>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Service Title</label>
                            <input 
                                required
                                placeholder="e.g. Professional Home Cleaning"
                                value={newService.title}
                                onChange={e => setNewService({...newService, title: e.target.value})}
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                            />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Category</label>
                                <select 
                                    value={newService.category}
                                    onChange={e => setNewService({...newService, category: e.target.value})}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                                >
                                    <option value="">Select</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Painting">Painting</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Price (₹)</label>
                                <input 
                                    required
                                    type="number"
                                    value={newService.price}
                                    onChange={e => setNewService({...newService, price: e.target.value})}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: "30px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Description</label>
                            <textarea 
                                placeholder="Tell customers what's included..."
                                value={newService.description}
                                onChange={e => setNewService({...newService, description: e.target.value})}
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", height: "100px" }}
                            />
                        </div>
                        <div style={{ background: "rgba(245, 158, 11, 0.1)", color: "#d97706", padding: "15px", borderRadius: "8px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
                            <div style={{ background: "#f59e0b", color: "white", padding: "4px 8px", borderRadius: "10px", fontWeight: "bold", fontSize: "0.8rem" }}>50</div>
                            <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>HalpCoins will be deducted from your wallet to post this ad.</span>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "15px", fontSize: "1rem" }}>List Service Now</button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Share Update / Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="card" 
                    style={{ width: "100%", maxWidth: "500px", padding: "30px", background: "white", border: "2px solid var(--primary)" }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Share an Update</h2>
                        <button onClick={() => setShowCreatePost(false)} style={{ border: "none", background: "none", cursor: "pointer" }}><X /></button>
                    </div>

                    <form onSubmit={handleCreatePost}>
                        <textarea 
                            placeholder="Share your latest work, tips, or availability with the community..." 
                            style={{ width: "100%", border: "1px solid #e2e8f0", padding: "15px", fontSize: "1rem", outline: "none", minHeight: "120px", resize: "none", borderRadius: "8px", marginBottom: "20px" }}
                            value={newPost.content}
                            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "600" }}>
                                <Camera size={20} /> Add Photo
                            </div>
                            <button type="submit" className="btn-primary" style={{ padding: "10px 25px" }}>Post Now</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* AI Verification Modal */}
      <AnimatePresence>
        {verifyingJob && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="card" 
                    style={{ width: "100%", maxWidth: "600px", padding: "40px", background: "white" }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "10px", borderRadius: "12px" }}>
                                <Brain size={24} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>AI Quality Verification</h2>
                        </div>
                        <button onClick={() => setVerifyingJob(null)} style={{ border: "none", background: "none", cursor: "pointer" }}><X /></button>
                    </div>

                    <p style={{ color: "#64748b", marginBottom: "30px" }}>Upload photos of the service area before and after the work to get an AI-certified quality report.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "10px", fontWeight: "700", fontSize: "0.85rem", color: "#64748b" }}>BEFORE PHOTO</label>
                            <div 
                                onClick={() => setVerifyPhotos({...verifyPhotos, before: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400"})}
                                style={{ height: "150px", border: "2px dashed #e2e8f0", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: verifyPhotos.before ? `url(${verifyPhotos.before}) center/cover` : "#f8fafc" }}
                            >
                                {!verifyPhotos.before && <><Camera size={30} color="#94a3b8" /><span style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "10px" }}>Click to Upload</span></>}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "10px", fontWeight: "700", fontSize: "0.85rem", color: "#64748b" }}>AFTER PHOTO</label>
                            <div 
                                onClick={() => setVerifyPhotos({...verifyPhotos, after: "https://images.unsplash.com/photo-1527385352018-3c26dd6c3916?w=400"})}
                                style={{ height: "150px", border: "2px dashed #e2e8f0", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: verifyPhotos.after ? `url(${verifyPhotos.after}) center/cover` : "#f8fafc" }}
                            >
                                {!verifyPhotos.after && <><Camera size={30} color="#94a3b8" /><span style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "10px" }}>Click to Upload</span></>}
                            </div>
                        </div>
                    </div>

                    <button 
                        className="btn-primary" 
                        style={{ width: "100%", padding: "15px", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                        disabled={isAnalyzing}
                        onClick={handleVerify}
                    >
                        {isAnalyzing ? "AI is Analyzing..." : <><Brain size={20} /> Run AI Analysis</>}
                    </button>
                    {isAnalyzing && <p style={{ textAlign: "center", marginTop: "15px", fontSize: "0.85rem", color: "var(--primary)", fontWeight: "600" }}>Detecting textures, patterns, and work completion...</p>}
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function JobCard({ job, type, onUpdate, onVerify }) {
  return (
    <motion.div 
      layout
      className="card flex-col-mobile"
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", gap: "24px", flexWrap: "wrap" }}
    >
      <div style={{ flex: 1, minWidth: "300px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <span style={{ 
            padding: "4px 12px", 
            borderRadius: "20px", 
            fontSize: "0.7rem", 
            fontWeight: "800",
            background: job.status === 'pending' ? "#fef9c3" : (job.status === 'accepted' ? "#dcfce7" : "#f1f5f9"),
            color: job.status === 'pending' ? "#854d0e" : (job.status === 'accepted' ? "#166534" : "#64748b")
          }}>
            {job.status.toUpperCase()}
          </span>
          <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>REF: #{job._id.slice(-6).toUpperCase()}</span>
        </div>

        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          {job.service_name}
          <span style={{ color: "var(--primary)", fontSize: "1rem" }}>₹{job.price}</span>
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "0.875rem" }}>
            <Calendar size={14} /> {new Date(job.date).toLocaleDateString()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "0.875rem" }}>
            <User size={14} /> {job.user_name || "Customer"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "0.875rem", gridColumn: "span 2" }}>
            <MapPin size={14} /> {job.address}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        {type === 'new' && (
          <>
            <button 
              onClick={() => onUpdate(job._id, 'accepted')}
              style={{ background: "#10b981", color: "white", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <CheckCircle size={18} /> Accept
            </button>
            <button 
              onClick={() => onUpdate(job._id, 'rejected')}
              style={{ background: "white", color: "#ef4444", border: "1px solid #ef4444", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <XCircle size={18} /> Reject
            </button>
          </>
        )}
        {type === 'active' && (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", width: "100%" }}>
            <a href={`tel:+919313116750`} style={{ flex: "1", textAlign: "center", background: "#f1f5f9", color: "#1e293b", border: "1px solid #e2e8f0", padding: "10px 15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none", borderRadius: "8px", fontWeight: "600" }}>
              <Phone size={18} /> Call
            </a>
            <a href={`https://wa.me/919313116750?text=Hi, I am your HelpHub expert.`} target="_blank" rel="noreferrer" style={{ flex: "1", textAlign: "center", background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", padding: "10px 15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none", borderRadius: "8px", fontWeight: "600" }}>
              <MessageCircle size={18} /> WhatsApp
            </a>
            <div style={{ width: "100%", display: "flex", gap: "12px", marginTop: "10px" }}>
              <button 
                onClick={onVerify}
                style={{ flex: 1, background: "white", color: "var(--primary)", border: "1px solid var(--primary)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <Brain size={18} /> Check
              </button>
              <button 
                onClick={() => onUpdate(job._id, 'completed')}
                style={{ flex: 1, background: "var(--primary)", color: "white", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <CheckSquare size={18} /> Done
              </button>
            </div>
          </div>
        )}
        {type === 'history' && (
          <div style={{ color: "#94a3b8", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle size={16} /> Record Updated
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="card" style={{ textAlign: "center", padding: "60px", background: "white" }}>
      <div style={{ color: "#cbd5e1", marginBottom: "20px", display: "flex", justifyContent: "center" }}>{icon}</div>
      <h3 style={{ color: "#1e293b", margin: 0 }}>{text}</h3>
      <p style={{ color: "#64748b", marginTop: "10px" }}>New updates will appear here automatically.</p>
    </div>
  );
}

export default ProviderDashboard;
