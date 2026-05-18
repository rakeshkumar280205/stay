import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Auth Page
import { AuthPage } from "./pages/AuthPage";

// User Pages
import { UserHomePage } from "./pages/UserHomePage";
import { HotelDetailsPage } from "./pages/HotelDetailsPage";
import { BookingPage } from "./pages/BookingPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";

// Host Pages
import { HostDashboardPage } from "./pages/HostDashboardPage";
import { AddHotelPage } from "./pages/AddHotelPage";
import { EditHotelPage } from "./pages/EditHotelPage";
import { AddRoomsPage } from "./pages/AddRoomsPage";
import { EditRoomPage } from "./pages/EditRoomPage";
import { HostRoomsPage } from "./pages/HostRoomsPage";
import { HostBookingsPage } from "./pages/HostBookingsPage";
import { HostReviewsPage } from "./pages/HostReviewsPage";

// Admin Pages
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AdminHostsPage } from "./pages/AdminHostsPage";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Auth - No protection */}
                    <Route path="/" element={<AuthPage />} />

                    {/* User Routes */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute allowedRoles={["user"]}>
                                <UserHomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/hotels"
                        element={
                            <ProtectedRoute allowedRoles={["user"]}>
                                <UserHomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/hotel/:hotelId"
                        element={
                            <ProtectedRoute allowedRoles={["user"]}>
                                <HotelDetailsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/booking/:roomId"
                        element={
                            <ProtectedRoute allowedRoles={["user"]}>
                                <BookingPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-bookings"
                        element={
                            <ProtectedRoute allowedRoles={["user"]}>
                                <MyBookingsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Host Routes */}
                    <Route
                        path="/host/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["host", "admin"]}>
                                <HostDashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/host/add-hotel"
                        element={
                            <ProtectedRoute allowedRoles={["host", "admin"]}>
                                <AddHotelPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/host/edit-hotel/:hotelId"
                        element={
                            <ProtectedRoute allowedRoles={["host", "admin"]}>
                                <EditHotelPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/host/rooms/:hotelId"
                        element={
                            <ProtectedRoute allowedRoles={["host", "admin"]}>
                                <HostRoomsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/host/add-rooms/:hotelId"
                        element={
                            <ProtectedRoute allowedRoles={["host", "admin"]}>
                                <AddRoomsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/host/edit-room/:roomId"
                        element={
                            <ProtectedRoute allowedRoles={["host", "admin"]}>
                                <EditRoomPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/host/bookings"
                        element={
                            <ProtectedRoute allowedRoles={["host", "admin"]}>
                                <HostBookingsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/host/reviews"
                        element={
                            <ProtectedRoute allowedRoles={["host", "admin"]}>
                                <HostReviewsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminDashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminUsersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/hosts"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminHostsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
