import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../api/api";

/**
 * Login/Register Page (Initial Screen)
 */
export const AuthPage = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [mode, setMode] = useState("login"); // "login", "register", "host-login", "host-register"
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone") {
            const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
            setFormData({ ...formData, [name]: digitsOnly });
            return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleUserRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await authAPI.registerUser({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
            });

            login("user", response.data.userId, null);
            navigate("/home");
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleUserLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await authAPI.loginUser({
                phone: formData.phone,
                password: formData.password,
            });

            login("user", response.data.userId, null);
            navigate("/home");
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleHostRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await authAPI.registerHost({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
            });

            login(response.data.role, null, response.data.hostId);
            navigate(response.data.role === "admin" ? "/admin/dashboard" : "/host/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleHostLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await authAPI.loginHost({
                email: formData.email,
                password: formData.password,
            });

            login(response.data.role, null, response.data.hostId);
            navigate(response.data.role === "admin" ? "/admin/dashboard" : "/host/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B1F3A] via-[#102A4C] to-[#173B6C] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 transform hover:scale-[1.01] transition-all duration-300">
                {/* Header with dark blue accent */}
                <div className="bg-gradient-to-r from-[#0B1F3A] via-[#102A4C] to-[#173B6C] px-8 py-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A00] rounded-full filter blur-3xl opacity-20"></div>
                    <h1 className="text-4xl font-extrabold text-center text-white relative z-10">🏨 StayEase</h1>
                    <p className="text-center text-[#E2E8F0] text-sm mt-3 font-medium">Your Perfect Stay Awaits</p>
                </div>

                <div className="px-8 py-8">
                    {/* Mode Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => setMode("login")}
                            className={`py-3.5 rounded-xl font-bold transition-all duration-300 ${mode === "login" || mode === "register"
                                ? "bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white shadow-lg scale-105"
                                : "bg-[#E2E8F0] text-[#64748B] hover:bg-[#FFA94D] hover:text-white hover:scale-105"
                                }`}
                        >
                            👤 Guest
                        </button>
                        <button
                            onClick={() => setMode("host-login")}
                            className={`py-3.5 rounded-xl font-bold transition-all duration-300 ${mode === "host-login" || mode === "host-register"
                                ? "bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white shadow-lg scale-105"
                                : "bg-[#E2E8F0] text-[#64748B] hover:bg-[#FFA94D] hover:text-white hover:scale-105"
                                }`}
                        >
                            🏢 Host
                        </button>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={
                            mode === "login"
                                ? handleUserLogin
                                : mode === "register"
                                    ? handleUserRegister
                                    : mode === "host-login"
                                        ? handleHostLogin
                                        : handleHostRegister
                        }
                        className="space-y-4"
                    >
                        {(mode === "register" || mode === "host-register") && (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all duration-200"
                                />
                                {mode === "host-register" && (
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all duration-200"
                                    />
                                )}
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    maxLength={10}
                                    inputMode="numeric"
                                    pattern="\d{10}"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all duration-200"
                                />
                            </>
                        )}

                        {(mode === "host-login" || mode === "host-register") && mode !== "host-register" && (
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all duration-300 bg-gray-50 focus:bg-white"
                            />
                        )}

                        {mode === "login" && (
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                maxLength={10}
                                inputMode="numeric"
                                pattern="\d{10}"
                                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all duration-300 bg-gray-50 focus:bg-white"
                            />
                        )}

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3.5 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all duration-300 bg-gray-50 focus:bg-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#FF7A00] transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {error && <p className="text-red-600 text-sm text-center bg-red-50 py-3 px-4 rounded-xl font-medium border-l-4 border-red-600">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                        >
                            {loading ? "Processing..." : mode === "login" || mode === "host-login" ? "✅ Login" : "✨ Register"}
                        </button>
                    </form>

                    {/* Toggle between Login/Register */}
                    <p className="text-center mt-6 text-gray-600">
                        {mode === "login" ? (
                            <>
                                Don't have an account?{" "}
                                <button onClick={() => setMode("register")} className="text-[#FF7A00] font-semibold hover:text-[#FF8C1A] transition-colors duration-200">
                                    Register here
                                </button>
                            </>
                        ) : mode === "register" ? (
                            <>
                                Already have an account?{" "}
                                <button onClick={() => setMode("login")} className="text-[#FF7A00] font-semibold hover:text-[#FF8C1A] transition-colors duration-200">
                                    Login here
                                </button>
                            </>
                        ) : mode === "host-login" ? (
                            <>
                                New host?{" "}
                                <button onClick={() => setMode("host-register")} className="text-[#FF7A00] font-semibold hover:text-[#FF8C1A] transition-colors duration-200">
                                    Register here
                                </button>
                            </>
                        ) : (
                            <>
                                Already a host?{" "}
                                <button onClick={() => setMode("host-login")} className="text-[#FF7A00] font-semibold hover:text-[#FF8C1A] transition-colors duration-200">
                                    Login here
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};
