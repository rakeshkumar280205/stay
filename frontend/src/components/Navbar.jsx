import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../api/api";

/**
 * Navbar Component - Changes based on user role
 */
export const Navbar = () => {
    const navigate = useNavigate();
    const { auth, logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            logout();
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="bg-gradient-to-r from-[#0B1F3A] to-[#102A4C] text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1
                    className="text-2xl font-bold cursor-pointer hover:text-[#FFA94D] transition-all duration-300 hover:scale-105"
                    onClick={() => navigate("/")}
                >
                    🏨 StayEase
                </h1>

                <div className="flex items-center gap-8">
                    {!auth.authenticated ? (
                        <button
                            onClick={() => navigate("/")}
                            className="bg-[#FF7A00] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#FF8C1A] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                        >
                            Login
                        </button>
                    ) : auth.role === "user" ? (
                        <>
                            <button
                                onClick={() => navigate("/home")}
                                className="hover:text-[#FF7A00] border-b-2 border-transparent hover:border-[#FF7A00] pb-1 transition-all duration-300 font-medium"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => navigate("/my-bookings")}
                                className="hover:text-[#FF7A00] border-b-2 border-transparent hover:border-[#FF7A00] pb-1 transition-all duration-300 font-medium"
                            >
                                My Bookings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-[#FF7A00] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#FF8C1A] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                            >
                                Logout
                            </button>
                        </>
                    ) : auth.role === "host" ? (
                        <>
                            <button
                                onClick={() => navigate("/host/dashboard")}
                                className="hover:text-[#FF7A00] border-b-2 border-transparent hover:border-[#FF7A00] pb-1 transition-all duration-300 font-medium"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate("/host/add-hotel")}
                                className="hover:text-[#FF7A00] border-b-2 border-transparent hover:border-[#FF7A00] pb-1 transition-all duration-300 font-medium"
                            >
                                Add Hotel
                            </button>
                            <button
                                onClick={() => navigate("/host/bookings")}
                                className="hover:text-[#FF7A00] border-b-2 border-transparent hover:border-[#FF7A00] pb-1 transition-all duration-300 font-medium"
                            >
                                Bookings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-[#FF7A00] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#FF8C1A] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                            >
                                Logout
                            </button>
                        </>
                    ) : auth.role === "admin" ? (
                        <>
                            <button
                                onClick={() => navigate("/admin/dashboard")}
                                className="hover:text-[#FF7A00] border-b-2 border-transparent hover:border-[#FF7A00] pb-1 transition-all duration-300 font-medium"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate("/admin/users")}
                                className="hover:text-[#FF7A00] border-b-2 border-transparent hover:border-[#FF7A00] pb-1 transition-all duration-300 font-medium"
                            >
                                Users
                            </button>
                            <button
                                onClick={() => navigate("/admin/hosts")}
                                className="hover:text-[#FF7A00] border-b-2 border-transparent hover:border-[#FF7A00] pb-1 transition-all duration-300 font-medium"
                            >
                                Hosts
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-[#FF7A00] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#FF8C1A] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                            >
                                Logout
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </nav>
    );
};
