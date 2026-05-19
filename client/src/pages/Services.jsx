import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchServices } from "../api";
import ServiceCard from "../components/ServiceCard";
import MapView from "../components/MapView";
import SmartSearch from "../components/SmartSearch";
import { Map, List, Filter, SlidersHorizontal, Search, Zap } from "lucide-react";

function Services() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list"); 
  const [activeCategory, setActiveCategory] = useState("All");
  const location = useLocation();

  const categories = ["All", "Cleaning", "Repair", "Electrical", "Plumbing", "Decor", "Moving"];

  useEffect(() => {
    const getServices = async () => {
      try {
        const { data } = await fetchServices();
        setServices(data);
        setFilteredServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    getServices();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q");
    if (query && services.length > 0) {
      handleSearch(query);
    }
  }, [location.search, services]);

  const handleSearch = (query) => {
    if (!query.trim()) {
      filterByCategory(activeCategory);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = services.filter((s) => {
        return s.name.toLowerCase().includes(lowerQuery) || 
               s.description.toLowerCase().includes(lowerQuery) ||
               s.category.toLowerCase().includes(lowerQuery);
    });
    setFilteredServices(filtered);
  };

  const filterByCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === "All") {
        setFilteredServices(services);
    } else {
        setFilteredServices(services.filter(s => s.category.toLowerCase().includes(cat.toLowerCase()) || s.name.toLowerCase().includes(cat.toLowerCase())));
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Premium Header */}
      <section style={{ background: "white", padding: "60px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "30px" }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--primary)", fontWeight: "800", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
                        <Zap size={14} fill="var(--primary)" /> Elite Professionals
                    </div>
                    <h1 style={{ fontSize: "3rem", fontWeight: "900", color: "#1e293b", margin: 0 }}>Discover Services</h1>
                    <p style={{ color: "#64748b", fontSize: "1.1rem", marginTop: "10px" }}>Top-rated experts, verified by AI, ready to help you.</p>
                </div>
                
                <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "15px", padding: "6px" }}>
                    <button 
                        onClick={() => setViewMode("list")}
                        style={{ 
                            padding: "10px 25px", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer",
                            background: viewMode === "list" ? "white" : "transparent",
                            color: viewMode === "list" ? "#1e293b" : "#64748b",
                            boxShadow: viewMode === "list" ? "0 4px 10px rgba(0,0,0,0.05)" : "none",
                            display: "flex", alignItems: "center", gap: "8px"
                        }}
                    >
                        <List size={18} /> List View
                    </button>
                    <button 
                        onClick={() => setViewMode("map")}
                        style={{ 
                            padding: "10px 25px", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer",
                            background: viewMode === "map" ? "white" : "transparent",
                            color: viewMode === "map" ? "#1e293b" : "#64748b",
                            boxShadow: viewMode === "map" ? "0 4px 10px rgba(0,0,0,0.05)" : "none",
                            display: "flex", alignItems: "center", gap: "8px"
                        }}
                    >
                        <Map size={18} /> Map View
                    </button>
                </div>
            </div>
        </div>
      </section>

      <div className="container" style={{ padding: "50px 20px" }}>
        <div className="responsive-sidebar-grid" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px" }}>
            
            {/* Sidebar Filters */}
            <aside className="sticky-sidebar" style={{ position: "sticky", top: "120px", height: "fit-content" }}>
                <div className="card" style={{ padding: "30px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px", fontWeight: "800", color: "#1e293b" }}>
                        <SlidersHorizontal size={20} /> Filters
                    </div>
                    
                    <div style={{ marginBottom: "30px" }}>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "15px" }}>Search</label>
                        <SmartSearch onSearch={handleSearch} />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "15px" }}>Categories</label>
                        <div style={{ display: "grid", gap: "10px" }}>
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => filterByCategory(cat)}
                                    style={{ 
                                        textAlign: "left", padding: "12px 15px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600",
                                        background: activeCategory === cat ? "var(--primary-light)" : "transparent",
                                        color: activeCategory === cat ? "var(--primary)" : "#64748b",
                                        transition: "0.3s"
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main>
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "100px" }}>Analyzing services...</div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {viewMode === "list" ? (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
                                    {filteredServices.map((service) => (
                                        <ServiceCard key={service._id} service={service} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ borderRadius: "30px", overflow: "hidden", border: "1px solid #f1f5f9" }}>
                                    <MapView services={filteredServices} />
                                </div>
                            )}

                            {!loading && filteredServices.length === 0 && (
                                <div style={{ textAlign: "center", padding: "100px", color: "#94a3b8" }}>
                                    <Search size={60} style={{ margin: "0 auto 20px", opacity: 0.2 }} />
                                    <h3>No Elite Services Found</h3>
                                    <p>Try adjusting your search or filters.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
      </div>
    </div>
  );
}

export default Services;

