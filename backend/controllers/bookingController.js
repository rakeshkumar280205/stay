import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

/**
 * Create booking (user only)
 */
export const createBooking = async (req, res) => {
    try {
        const { hotelId, roomId, checkIn, checkOut, guestsCount } = req.body;
        const userId = req.userId;

        if (!roomId || !checkIn || !checkOut || guestsCount === undefined || guestsCount === null) {
            return res.status(400).json({ message: "roomId, checkIn, checkOut, and guestsCount are required" });
        }

        const guestsNumber = Number(guestsCount);
        if (!Number.isFinite(guestsNumber) || guestsNumber < 1) {
            return res.status(400).json({ message: "Guests count must be at least 1" });
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
            return res.status(400).json({ message: "Invalid check-in or check-out date" });
        }

        if (checkInDate >= checkOutDate) {
            return res.status(400).json({ message: "Check-out must be after check-in" });
        }

        // Verify room and derive hotel ID if frontend did not send it.
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (room.availableRoomsCount <= 0) {
            return res.status(400).json({ message: "This room is sold out" });
        }

        const resolvedHotelId = hotelId || room.hotelId.toString();
        if (room.hotelId.toString() !== resolvedHotelId) {
            return res.status(400).json({ message: "Selected room does not belong to the provided hotel" });
        }

        // Create booking with pending status
        const newBooking = new Booking({
            userId,
            hotelId: resolvedHotelId,
            roomId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guestsCount: guestsNumber,
            status: "pending",
        });

        await newBooking.save();

        res.status(201).json({
            message: "Booking created successfully (awaiting approval)",
            booking: newBooking,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get user bookings
 */
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.userId;

        const bookings = await Booking.find({ userId })
            .populate("hotelId", "hotelName location")
            .populate("roomId", "roomType price")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get bookings for host's hotels
 */
export const getHostBookings = async (req, res) => {
    try {
        const hostId = req.hostId;

        // Get all hotels by host
        const hotels = await Hotel.find({ hostId });
        const hotelIds = hotels.map((h) => h._id);

        // Get bookings for these hotels
        const bookings = await Booking.find({ hotelId: { $in: hotelIds } })
            .populate("userId", "name phone email")
            .populate("hotelId", "hotelName")
            .populate("roomId", "roomType price")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Approve booking (host only)
 */
export const approveBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const hostId = req.hostId;

        const booking = await Booking.findById(bookingId).populate("hotelId");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.hotelId.hostId.toString() !== hostId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        booking.status = "approved";
        await booking.save();

        res.json({
            message: "Booking approved",
            booking,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Reject booking (host only)
 */
export const rejectBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const hostId = req.hostId;

        const booking = await Booking.findById(bookingId).populate("hotelId");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.hotelId.hostId.toString() !== hostId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        booking.status = "rejected";
        await booking.save();

        res.json({
            message: "Booking rejected",
            booking,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Cancel booking (user only)
 */
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.userId;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Can only cancel pending bookings
        if (booking.status !== "pending") {
            return res.status(400).json({ message: "Cannot cancel approved/rejected booking" });
        }

        await Booking.findByIdAndDelete(bookingId);

        res.json({ message: "Booking cancelled" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
