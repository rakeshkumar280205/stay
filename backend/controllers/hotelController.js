import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { uploadBufferToCloudinary } from "../config/cloudinary.js";

/**
 * Get all hotels (public for users, filtered for hosts)
 */
export const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find()
            .populate("hostId", "name email phone")
            .sort({ createdAt: -1 })
            .lean();

        const minPrices = await Room.aggregate([
            { $group: { _id: "$hotelId", minPrice: { $min: "$price" } } },
        ]);
        const minPriceMap = new Map(
            minPrices.map((item) => [item._id.toString(), item.minPrice])
        );

        const hotelsWithPrice = hotels.map((hotel) => ({
            ...hotel,
            minPrice: minPriceMap.get(hotel._id.toString()) ?? null,
        }));

        res.json(hotelsWithPrice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get hotel by ID with rooms
 */
export const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid hotel id" });
        }

        const hotel = await Hotel.findById(id)
            .populate("hostId", "name email phone");

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get hotels by host (only for authenticated host)
 */
export const getHostHotels = async (req, res) => {
    try {
        const hostId = req.hostId;

        const hotels = await Hotel.find({ hostId })
            .populate("hostId", "name email phone")
            .sort({ createdAt: -1 })
            .lean();

        const minPrices = await Room.aggregate([
            { $match: { hotelId: { $in: hotels.map((h) => h._id) } } },
            { $group: { _id: "$hotelId", minPrice: { $min: "$price" } } },
        ]);
        const minPriceMap = new Map(
            minPrices.map((item) => [item._id.toString(), item.minPrice])
        );

        const hotelsWithPrice = hotels.map((hotel) => ({
            ...hotel,
            minPrice: minPriceMap.get(hotel._id.toString()) ?? null,
        }));

        res.json(hotelsWithPrice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Create hotel (host only)
 */
export const createHotel = async (req, res) => {
    try {
        const { hotelName, location, description } = req.body;
        const hostId = req.hostId;
        const files = req.files; // multer files array

        if (!hotelName || !location || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Upload images to Cloudinary if files are provided
        let imageUrls = [];
        if (files && files.length > 0) {
            console.log(`Uploading ${files.length} images to Cloudinary...`);

            const uploadPromises = files.map((file) =>
                uploadBufferToCloudinary(file.buffer, "stayease/hotels")
            );

            imageUrls = await Promise.all(uploadPromises);
            console.log(`Successfully uploaded ${imageUrls.length} images`);
        }

        const newHotel = new Hotel({
            hotelName,
            location,
            description,
            images: imageUrls,
            hostId,
        });

        await newHotel.save();

        res.status(201).json({
            message: "Hotel created successfully",
            hotel: newHotel,
        });
    } catch (error) {
        console.error("Create hotel error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update hotel (host only)
 */
export const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const { hotelName, location, description, existingImages } = req.body;
        const hostId = req.hostId;
        const files = req.files; // New images to upload

        const hotel = await Hotel.findById(id);

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        if (hotel.hostId.toString() !== hostId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Update basic fields
        hotel.hotelName = hotelName || hotel.hotelName;
        hotel.location = location || hotel.location;
        hotel.description = description || hotel.description;

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
            console.log(`Uploading ${files.length} new images to Cloudinary...`);

            const uploadPromises = files.map((file) =>
                uploadBufferToCloudinary(file.buffer, "stayease/hotels")
            );

            const newImageUrls = await Promise.all(uploadPromises);
            imageUrls = [...imageUrls, ...newImageUrls];
            console.log(`Successfully uploaded ${newImageUrls.length} images`);
        }

        hotel.images = imageUrls;

        await hotel.save();

        res.json({
            message: "Hotel updated successfully",
            hotel,
        });
    } catch (error) {
        console.error("Update hotel error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete hotel (host only)
 */
export const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const hostId = req.hostId;

        const hotel = await Hotel.findById(id);

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        if (hotel.hostId.toString() !== hostId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Hotel.findByIdAndDelete(id);

        res.json({ message: "Hotel deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
