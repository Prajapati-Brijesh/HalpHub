import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon issue with Leaflet in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapView({ services }) {
  // Center map around Gujarat approximately
  const defaultPosition = [22.5, 72.5]; 
  
  return (
    <div style={{ height: "600px", width: "100%", borderRadius: "20px", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)", marginTop: "20px" }}>
      <MapContainer center={defaultPosition} zoom={7} scrollWheelZoom={true} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {services.map((service) => {
          if (service.lat && service.lng) {
            return (
              <Marker key={service._id} position={[service.lat, service.lng]}>
                <Popup minWidth={200}>
                  <div style={{ textAlign: "center" }}>
                    <img src={service.image} alt={service.name} style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
                    <h3 style={{ margin: "5px 0", fontSize: "16px", color: "var(--text)" }}>{service.name}</h3>
                    <p style={{ margin: "0 0 10px 0", color: "var(--primary)", fontWeight: "600", fontSize: "14px" }}>₹{service.price}</p>
                    <Link to={`/services/${service._id}`} className="btn-primary" style={{ display: "block", padding: "8px", textDecoration: "none", borderRadius: "8px", fontSize: "14px", color: "white" }}>
                      Book Now
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;
