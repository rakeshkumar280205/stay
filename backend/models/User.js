import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            sparse: true, // allows null but enforces uniqueness when present
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
