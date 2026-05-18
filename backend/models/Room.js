import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true,
        },
        roomType: {
            type: String,
            enum: ["standard", "AC", "duplex", "triple", "quadra"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        amenities: [
            {
                type: String,
            },
        ],
        images: [
            {
                type: String, // Cloudinary URLs
            },
        ],
        availableRoomsCount: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
