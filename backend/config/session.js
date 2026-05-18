import session from "express-session";
import MongoStore from "connect-mongo";

/**
 * Configure express-session with MongoDB store
 */
export const sessionConfig = session({
    secret: process.env.SESSION_SECRET || "stayease-secret-key-2026",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600, // lazy session update
    }),
    cookie: {
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    name: "stayease.sid", // Custom session name
});
