import express from "express";
import {
    getRoomsByHotel,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
} from "../controllers/roomController.js";
import { isHostAuthenticated } from "../middleware/auth.js";
import { uploadMiddleware } from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/hotel/:hotelId", getRoomsByHotel);
router.get("/:id", getRoomById);

// Host routes
router.post("/", isHostAuthenticated, uploadMiddleware.hotelImages, createRoom);
router.put("/:id", isHostAuthenticated, uploadMiddleware.hotelImages, updateRoom);
router.delete("/:id", isHostAuthenticated, deleteRoom);

export default router;
