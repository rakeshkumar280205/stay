import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
    {
        hotelName: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        images: [
            {
                type: String, // Cloudinary URLs
            },
        ],
        hostId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Host",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);
