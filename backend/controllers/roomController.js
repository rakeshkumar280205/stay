import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { uploadBufferToCloudinary } from "../config/cloudinary.js";

/**
 * Get rooms by hotel
 */
export const getRoomsByHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;

        const rooms = await Room.find({ hotelId }).sort({ createdAt: -1 });

        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get room by ID
 */
export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        const room = await Room.findById(id).populate("hotelId");

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Create room (host only)
 */
export const createRoom = async (req, res) => {
    try {
        const { hotelId, roomType, price, amenities, availableRoomsCount } = req.body;
        const hostId = req.hostId;
        const files = req.files; // multer files array

        // Verify hotel belongs to host
        const hotel = await Hotel.findById(hotelId);
        if (!hotel || hotel.hostId.toString() !== hostId) {
            return res.status(403).json({ message: "Hotel not found or unauthorized" });
        }

        if (!hotelId || !roomType || !price) {
            return res.status(400).json({ message: "hotelId, roomType, and price are required" });
        }

        // Parse amenities if it's a JSON string
        let parsedAmenities = [];
        if (amenities) {
            try {
                parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
            } catch (e) {
                parsedAmenities = Array.isArray(amenities) ? amenities : [];
            }
        }

        // Upload images to Cloudinary if files are provided
        let imageUrls = [];
        if (files && files.length > 0) {
            console.log(`Uploading ${files.length} room images to Cloudinary...`);

            const uploadPromises = files.map((file) =>
                uploadBufferToCloudinary(file.buffer, "stayease/rooms")
            );

            imageUrls = await Promise.all(uploadPromises);
            console.log(`Successfully uploaded ${imageUrls.length} images`);
        }

        const newRoom = new Room({
            hotelId,
            roomType,
            price: parseInt(price),
            amenities: parsedAmenities,
            images: imageUrls,
            availableRoomsCount: availableRoomsCount ? parseInt(availableRoomsCount) : 1,
        });

        await newRoom.save();

        res.status(201).json({
            message: "Room created successfully",
            room: newRoom,
        });
    } catch (error) {
        console.error("Create room error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update room (host only)
 */
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomType, price, amenities, existingImages, availableRoomsCount } = req.body;
        const hostId = req.hostId;
        const files = req.files; // New images to upload

        const room = await Room.findById(id).populate("hotelId");

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (room.hotelId.hostId.toString() !== hostId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Update basic fields
        room.roomType = roomType || room.roomType;
        room.price = price ? parseInt(price) : room.price;
        if (availableRoomsCount) room.availableRoomsCount = parseInt(availableRoomsCount);

        // Handle amenities
        if (amenities) {
            try {
                room.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
            } catch (e) {
                room.amenities = Array.isArray(amenities) ? amenities : [];
            }
        }

        // Handle images
        let imageUrls = [];

        // Parse existing images (sent as JSON string from frontend)
        if (existingImages) {
            try {
                imageUrls = JSON.parse(existingImages);
            } catch (e) {
                imageUrls = Array.isArray(existingImages) ? existingImages : [];
            }
        }

        // Upload new images to Cloudinary if provided
        if (files && files.length > 0) {
            console.log(`Uploading ${files.length} new room images to Cloudinary...`);

            const uploadPromises = files.map((file) =>
                uploadBufferToCloudinary(file.buffer, "stayease/rooms")
            );

            const newImageUrls = await Promise.all(uploadPromises);
            imageUrls = [...imageUrls, ...newImageUrls];
            console.log(`Successfully uploaded ${newImageUrls.length} images`);
        }

        room.images = imageUrls;

        await room.save();

        res.json({
            message: "Room updated successfully",
            room,
        });
    } catch (error) {
        console.error("Update room error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete room (host only)
 */
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const hostId = req.hostId;

        const room = await Room.findById(id).populate("hotelId");

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (room.hotelId.hostId.toString() !== hostId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Room.findByIdAndDelete(id);

        res.json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
