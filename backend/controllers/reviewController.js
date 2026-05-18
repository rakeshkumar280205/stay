import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

/**
 * Create review (user only)
 */
export const createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const userId = req.userId;

        if (!bookingId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Verify booking exists and belongs to user
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Check if booking is approved
        if (booking.status !== "approved") {
            return res.status(400).json({ message: "Can only review approved bookings" });
        }

        // Check if review already exists for this booking
        const existingReview = await Review.findOne({ bookingId });
        if (existingReview) {
            return res.status(400).json({ message: "Review already submitted for this booking" });
        }

        const newReview = new Review({
            userId,
            hotelId: booking.hotelId,
            roomId: booking.roomId,
            bookingId,
            rating,
            comment,
        });

        await newReview.save();

        res.status(201).json({
            message: "Review submitted successfully",
            review: newReview,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get reviews by hotel
 */
export const getHotelReviews = async (req, res) => {
    try {
        const { hotelId } = req.params;

        const reviews = await Review.find({ hotelId })
            .populate("userId", "name phone")
            .populate("roomId", "roomType")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get reviews by room
 */
export const getRoomReviews = async (req, res) => {
    try {
        const { roomId } = req.params;

        const reviews = await Review.find({ roomId })
            .populate("userId", "name phone")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get user reviews
 */
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.userId;

        const reviews = await Review.find({ userId })
            .populate("hotelId", "hotelName")
            .populate("roomId", "roomType")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete review (user only)
 */
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.userId;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Review.findByIdAndDelete(reviewId);

        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
