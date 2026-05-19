import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchServices } from "../api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Star, MapPin, Clock, ShieldCheck, Phone, MessageCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import "leaflet/dist/leaflet.css";
import ReviewSection from "../components/ReviewSection";

function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: services } = await fetchServices();
        const s = services.find(x => x._id === id);
        setService(s);
      } catch (err) {
        toast.error("Error loading service data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: "100px", textAlign: "center" }}>Loading service...</div>;
  if (!service) return <div className="container" style={{ padding: "100px", textAlign: "center" }}>Service not found</div>;

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px" }}>
        {/* Left Side: Info & Reviews */}
        <div>
          <img src={service.image} alt={service.name} style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "24px", marginBottom: "30px", boxShadow: "var(--shadow-lg)" }} />
          
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ fontSize: "2.8rem", marginBottom: "15px", fontWeight: "800" }}>{service.name}</h1>
            <div style={{ display: "flex", gap: "20px", color: "var(--text-muted)", marginBottom: "20px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f1f5f9", padding: "6px 14px", borderRadius: "20px", fontSize: "0.9rem" }}>
                <MapPin size={18} /> {service.location}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff7ed", color: "#9a3412", padding: "6px 14px", borderRadius: "20px", fontSize: "0.9rem", fontWeight: "600" }}>
                <Star size={18} fill="#f59e0b" color="#f59e0b" /> Top Rated
              </span>
            </div>
            <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "var(--text-muted)", background: "white", padding: "24px", borderRadius: "16px", border: "1px solid var(--border)" }}>
              {service.description}
            </p>
          </div>

          <ReviewSection serviceId={id} />
        </div>

        {/* Right Side: Map & Booking Sidebar */}
        <div style={{ position: "sticky", top: "120px", height: "fit-content" }}>
          <div className="card" style={{ padding: "30px", marginBottom: "24px" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "20px" }}>₹{service.price} <span style={{ fontSize: "1rem", color: "var(--secondary)", fontWeight: "400" }}>/ per service</span></div>
            <Link to={`/booking?serviceId=${service._id}`} className="btn-primary" style={{ display: "block", textAlign: "center", padding: "15px", marginBottom: "15px" }}>
              Book Appointment
            </Link>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <a href={`tel:+919313116750`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#f1f5f9", color: "#1e293b", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: "600" }}>
                <Phone size={18} /> Call
              </a>
              <a href={`https://wa.me/919313116750?text=Hi, I am interested in your ${service.name} service.`} target="_blank" rel="noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#dcfce7", color: "#166534", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: "600" }}>
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><ShieldCheck size={16} color="#166534" /> 100% Satisfaction Guarantee</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Clock size={16} /> 24/7 Availability</div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden", height: "300px" }}>
            <MapContainer center={[23.0225, 72.5714]} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[23.0225, 72.5714]}>
                <Popup>{service.name} is available here!</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetails;
