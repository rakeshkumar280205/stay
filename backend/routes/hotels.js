import express from "express";
import {
    getAllHotels,
    getHotelById,
    getHostHotels,
    createHotel,
    updateHotel,
    deleteHotel,
} from "../controllers/hotelController.js";
import { isHostAuthenticated } from "../middleware/auth.js";
import { uploadMiddleware } from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAllHotels);
router.get("/:id", getHotelById);

// Host routes
router.get("/host/my-hotels", isHostAuthenticated, getHostHotels);
router.post("/", isHostAuthenticated, uploadMiddleware.hotelImages, createHotel);
router.put("/:id", isHostAuthenticated, uploadMiddleware.hotelImages, updateHotel);
router.delete("/:id", isHostAuthenticated, deleteHotel);

export default router;
