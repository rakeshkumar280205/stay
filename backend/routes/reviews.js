import express from "express";
import {
    createReview,
    getHotelReviews,
    getRoomReviews,
    getUserReviews,
    deleteReview,
} from "../controllers/reviewController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// User routes
router.post("/", isAuthenticated, createReview);
router.get("/user/my-reviews", isAuthenticated, getUserReviews);
router.delete("/:reviewId", isAuthenticated, deleteReview);

// Public routes
router.get("/hotel/:hotelId", getHotelReviews);
router.get("/room/:roomId", getRoomReviews);

export default router;
