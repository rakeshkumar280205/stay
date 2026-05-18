import express from "express";
import {
    createBooking,
    getUserBookings,
    getHostBookings,
    approveBooking,
    rejectBooking,
    cancelBooking,
} from "../controllers/bookingController.js";
import { isAuthenticated, isHostAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// User routes
router.post("/", isAuthenticated, createBooking);
router.get("/user/my-bookings", isAuthenticated, getUserBookings);
router.delete("/:bookingId", isAuthenticated, cancelBooking);

// Host routes
router.get("/host/all", isHostAuthenticated, getHostBookings);
router.put("/:bookingId/approve", isHostAuthenticated, approveBooking);
router.put("/:bookingId/reject", isHostAuthenticated, rejectBooking);

export default router;
