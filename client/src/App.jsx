import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ProviderDashboard from "./pages/ProviderDashboard";
import ServiceDetails from "./pages/ServiceDetails";
import Wallet from "./pages/Wallet";
import BudgetEstimator from "./pages/BudgetEstimator";
import BecomeProvider from "./pages/BecomeProvider";
import Feed from "./pages/Feed";
import MeetingRoom from "./pages/MeetingRoom";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CreatePost from "./pages/CreatePost";
import LiveActivityPopup from "./components/LiveActivityPopup";
import EmergencyButton from "./components/EmergencyButton";

import AIAssistant from "./components/AIAssistant";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main style={{ minHeight: "calc(100vh - 80px)" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/become-provider" element={<BecomeProvider />} />
          <Route path="/budget-estimator" element={<BudgetEstimator />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/meeting" element={<MeetingRoom />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </main>
      {!isAdminRoute && <AIAssistant />}
      {!isAdminRoute && <LiveActivityPopup />}
      {!isAdminRoute && <EmergencyButton />}
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Layout />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
