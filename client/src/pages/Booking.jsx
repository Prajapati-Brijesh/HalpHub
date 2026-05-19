import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking, fetchServices } from "../api";
import PaymentModal from "../components/PaymentModal";
import { toast } from "react-hot-toast";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const serviceId = queryParams.get('serviceId');

  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({ address: "", date: "" });
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      const { data } = await fetchServices();
      const s = data.find(x => x._id === serviceId);
      setService(s);
    };
    if (serviceId) loadService();
  }, [serviceId]);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      toast.error("Please login first");
      return navigate('/login');
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (method) => {
    setLoading(true);
    try {
      await createBooking({ 
        ...formData, 
        service: serviceId, 
        payment_method: method,
        price: service?.price,
        service_name: service?.name
      });
      toast.success("Booking Confirmed!");
      navigate('/dashboard');
    } catch (err) {
      toast.error("Booking failed");
    } finally {
      setLoading(false);
      setShowPayment(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "500px", padding: "60px 20px" }}>
      <div className="card">
        <h2 style={{ marginBottom: "24px", textAlign: "center" }}>Book {service?.name || "Service"}</h2>
        
        <form onSubmit={handleInitialSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Service Address</label>
            <input 
              required
              placeholder="Enter full address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Booking Date</label>
            <input 
              required
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ padding: "14px" }}>
            Proceed to Payment
          </button>
        </form>
      </div>

      <PaymentModal 
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onPaymentSuccess={handlePaymentSuccess}
        amount={service?.price || 0}
      />
    </div>
  );
}

export default Booking;
