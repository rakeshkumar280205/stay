import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * Protected Route Component - Redirects to login if not authenticated
 */
export const ProtectedRoute = ({ children, allowedRoles = null }) => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        // Only redirect after loading is complete
        if (!auth.loading) {
            if (!auth.authenticated) {
                console.log("Not authenticated, redirecting to login");
                navigate("/", { replace: true });
                return;
            }

            // Check role authorization
            if (allowedRoles && !allowedRoles.includes(auth.role)) {
                console.log(`Role ${auth.role} not in allowed roles:`, allowedRoles);
                navigate("/", { replace: true });
                return;
            }
        }
    }, [auth.loading, auth.authenticated, auth.role, allowedRoles, navigate]);

    // Show loading screen while checking authentication
    if (auth.loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#F8FAFC]">
                <div className="text-6xl mb-4">🏨</div>
                <div className="text-[#0B1F3A] text-xl font-bold">Loading...</div>
            </div>
        );
    }

    // Prevent flash of content before redirect
    if (!auth.authenticated) {
        return null;
    }

    if (allowedRoles && !allowedRoles.includes(auth.role)) {
        return null;
    }

    return children;
};
