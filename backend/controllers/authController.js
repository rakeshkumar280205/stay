import User from "../models/User.js";
import Host from "../models/Host.js";
import bcrypt from "bcryptjs";

/**
 * Register as guest (User)
 */
export const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        // Validation
        if (!name || !phone || !password) {
            return res.status(400).json({ message: "Name, phone, and password are required" });
        }

        // Check if phone already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "Phone number already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            name,
            phone,
            email: email || null,
            password: hashedPassword,
        });

        await newUser.save();

        // Set session
        req.session.userId = newUser._id.toString();
        req.session.userRole = "user";

        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
            }
            res.status(201).json({
                message: "Registered successfully",
                userId: newUser._id,
                userRole: "user",
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Login as guest (User)
 */
export const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ message: "Phone and password are required" });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Set session
        req.session.userId = user._id.toString();
        req.session.userRole = "user";

        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
            }
            res.json({
                message: "Logged in successfully",
                userId: user._id,
                userRole: "user",
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Register as Host
 */
export const registerHost = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        if (!name || !phone || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingHost = await Host.findOne({ $or: [{ phone }, { email }] });
        if (existingHost) {
            return res.status(400).json({ message: "Phone or email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newHost = new Host({
            name,
            phone,
            email,
            password: hashedPassword,
            role: "host",
        });

        await newHost.save();

        req.session.hostId = newHost._id.toString();
        req.session.role = "host";

        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
            }
            res.status(201).json({
                message: "Host registered successfully",
                hostId: newHost._id,
                role: "host",
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Login as Host
 */
export const loginHost = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const host = await Host.findOne({ email });
        if (!host) {
            return res.status(400).json({ message: "Host not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, host.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        req.session.hostId = host._id.toString();
        req.session.role = host.role; // "host" or "admin"

        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
            }
            res.json({
                message: "Logged in successfully",
                hostId: host._id,
                role: host.role,
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Logout
 */
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout error" });
        }
        res.json({ message: "Logged out successfully" });
    });
};

/**
 * Get current session info
 */
export const getSession = (req, res) => {
    if (req.session.userId) {
        return res.json({
            authenticated: true,
            role: "user",
            userId: req.session.userId,
        });
    }

    if (req.session.hostId) {
        return res.json({
            authenticated: true,
            role: req.session.role, // "host" or "admin"
            hostId: req.session.hostId,
        });
    }

    res.json({
        authenticated: false,
        role: null,
    });
};
