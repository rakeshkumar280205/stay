import axios from "axios";

const API_BASE_URL = "/api";

// Configure axios to send cookies (for sessions)
axios.defaults.withCredentials = true;

export const api = axios.create({
    baseURL: API_BASE_URL,
});

// Auth API calls
export const authAPI = {
    registerUser: (data) => api.post("/auth/user/register", data),
    loginUser: (data) => api.post("/auth/user/login", data),
    registerHost: (data) => api.post("/auth/host/register", data),
    loginHost: (data) => api.post("/auth/host/login", data),
    logout: () => api.post("/auth/logout"),
    getSession: () => api.get("/auth/session"),
};

// Hotels API calls
export const hotelsAPI = {
    getAll: () => api.get("/hotels"),
    getById: (id) => api.get(`/hotels/${id}`),
    getHostHotels: () => api.get("/hotels/host/my-hotels"),
    create: (data) => api.post("/hotels", data),
    update: (id, data) => api.put(`/hotels/${id}`, data),
    delete: (id) => api.delete(`/hotels/${id}`),
};

// Rooms API calls
export const roomsAPI = {
    getByHotel: (hotelId) => api.get(`/rooms/hotel/${hotelId}`),
    getById: (id) => api.get(`/rooms/${id}`),
    create: (data) => api.post("/rooms", data),
    update: (id, data) => api.put(`/rooms/${id}`, data),
    delete: (id) => api.delete(`/rooms/${id}`),
};

// Bookings API calls
export const bookingsAPI = {
    create: (data) => api.post("/bookings", data),
    getMyBookings: () => api.get("/bookings/user/my-bookings"),
    getHostBookings: () => api.get("/bookings/host/all"),
    approve: (bookingId) => api.put(`/bookings/${bookingId}/approve`),
    reject: (bookingId) => api.put(`/bookings/${bookingId}/reject`),
    cancel: (bookingId) => api.delete(`/bookings/${bookingId}`),
};

// Reviews API calls
export const reviewsAPI = {
    create: (data) => api.post("/reviews", data),
    getMyReviews: () => api.get("/reviews/user/my-reviews"),
    getByHotel: (hotelId) => api.get(`/reviews/hotel/${hotelId}`),
    getByRoom: (roomId) => api.get(`/reviews/room/${roomId}`),
    delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

// Admin API calls
export const adminAPI = {
    getUsers: () => api.get("/admin/users"),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getHosts: () => api.get("/admin/hosts"),
    deleteHost: (id) => api.delete(`/admin/hosts/${id}`),
};

// Search API calls
export const searchAPI = {
    getSuggestions: (query) => api.get(`/search/suggestions?q=${encodeURIComponent(query)}`),
};
