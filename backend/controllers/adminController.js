import User from "../models/User.js";
import Host from "../models/Host.js";

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get user by ID (admin only)
 */
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get all hosts (admin only)
 */
export const getAllHosts = async (req, res) => {
    try {
        const hosts = await Host.find().select("-password").sort({ createdAt: -1 });
        res.json(hosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete host (admin only)
 */
export const deleteHost = async (req, res) => {
    try {
        const { id } = req.params;

        const host = await Host.findById(id);

        if (!host) {
            return res.status(404).json({ message: "Host not found" });
        }

        if (host.role === "admin") {
            return res.status(400).json({ message: "Cannot delete admin" });
        }

        await Host.findByIdAndDelete(id);

        res.json({ message: "Host deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
