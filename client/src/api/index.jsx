import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export const signIn = (formData) => API.post('/auth/login/', formData);
export const signUp = (formData) => API.post('/auth/signup/', formData);
export const updateAvatar = (avatarUrl) => API.put('/user/avatar/', { avatar: avatarUrl });

export const fetchServices = () => API.get('/services/');
export const createBooking = (bookingData) => API.post('/bookings/', bookingData);
export const fetchUserBookings = () => API.get('/bookings/user/');
export const deleteBooking = (id) => API.delete(`/bookings/${id}/`);

// Admin APIs
export const fetchAdminBookings = () => API.get('/admin/bookings/');
export const updateBookingStatus = (id, status) => API.put(`/admin/bookings/${id}/`, { status });
export const fetchAdminUsers = () => API.get('/admin/users/');
export const deleteUser = (id) => API.delete(`/admin/users/${id}/`);
export const deleteService = (id) => API.delete(`/admin/services/${id}/`);
export const fetchReviewSummary = (serviceId) => API.get(`/ai/review-summary/${serviceId}/`);
export const claimReferral = (code) => API.post('/referral/claim/', { code });
export const addCoinsToUser = (userId, amount) => API.post('/admin/coins/add/', { user_id: userId, amount });

// Mock Payment
export const processPayment = () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 2000));

// Reviews
export const fetchReviews = (serviceId) => API.get(`/reviews/${serviceId}/`);
export const createReview = (reviewData) => API.post('/reviews/', reviewData);
// Chatbot
export const sendChatMessage = (message) => API.post('/chat/', { message });

// Favorites
export const toggleFavorite = (serviceId) => API.post('/favorites/', { service_id: serviceId });

// Provider
export const fetchProviderBookings = () => API.get('/provider/bookings/');
export const fetchProviderServices = () => API.get('/provider/services/');
export const createService = (serviceData) => API.post('/provider/services/', serviceData);

// Social Feed
export const fetchFeed = () => API.get('/feed/');
export const createFeedPost = (postData) => API.post('/feed/create/', postData);

// AI Verification
export const verifyWork = (workData) => API.post('/verify-work/', workData);

// Membership
export const upgradeMembership = () => API.post('/membership/upgrade/');
