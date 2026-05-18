import express from "express";
import {
    getAllUsers,
    getUserById,
    getAllHosts,
    deleteUser,
    deleteHost,
} from "../controllers/adminController.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin routes
router.get("/users", isAdmin, getAllUsers);
router.get("/users/:id", isAdmin, getUserById);
router.delete("/users/:id", isAdmin, deleteUser);

router.get("/hosts", isAdmin, getAllHosts);
router.delete("/hosts/:id", isAdmin, deleteHost);

export default router;
