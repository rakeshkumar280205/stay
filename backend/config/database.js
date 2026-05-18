import mongoose from "mongoose";
import Host from "../models/Host.js";

/**
 * Connect to MongoDB and create default admin
 */
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✓ MongoDB Connected");

        // Check if admin exists, create if not
        const adminExists = await Host.findOne({ role: "admin" });
        if (!adminExists) {
            await createDefaultAdmin();
        }
    } catch (error) {
        console.error("✗ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

/**
 * Create default admin user if none exists
 */
const createDefaultAdmin = async () => {
    try {
        const bcrypt = await import("bcryptjs");
        const hashedPassword = await bcrypt.default.hash("admin123", 10);

        const admin = new Host({
            name: "Admin",
            email: "admin@stayease.com",
            phone: "0000000000",
            password: hashedPassword,
            role: "admin",
        });

        await admin.save();
        console.log("✓ Default admin created (admin@stayease.com / admin123)");
    } catch (error) {
        console.error("Error creating default admin:", error.message);
    }
};
