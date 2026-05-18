import { createContext, useState, useEffect } from "react";
import { authAPI } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        authenticated: false,
        role: null, // "user", "host", "admin"
        userId: null,
        hostId: null,
        loading: true,
    });

    // Check session on mount
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const response = await authAPI.getSession();
            setAuth({
                authenticated: response.data.authenticated,
                role: response.data.role || null,
                userId: response.data.userId || null,
                hostId: response.data.hostId || null,
                loading: false,
            });
        } catch (error) {
            console.error("Session check error:", error);
            setAuth((prev) => ({ ...prev, loading: false }));
        }
    };

    const login = (role, userId, hostId) => {
        setAuth({
            authenticated: true,
            role,
            userId: userId || null,
            hostId: hostId || null,
            loading: false,
        });
    };

    const logout = () => {
        setAuth({
            authenticated: false,
            role: null,
            userId: null,
            hostId: null,
            loading: false,
        });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, checkSession }}>
            {children}
        </AuthContext.Provider>
    );
};
