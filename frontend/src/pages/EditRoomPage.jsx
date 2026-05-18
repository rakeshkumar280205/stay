import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomsAPI } from "../api/api";
import { Navbar } from "../components/Navbar";
import { AmenitiesSelector } from "../components/AmenitiesSelector";

export const EditRoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ roomType: "standard", price: "", availableRoomsCount: 1, amenities: [] });
    const [existingImages, setExistingImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const successTimeoutRef = useRef(null);

    useEffect(() => {
        fetchRoom();
    }, [roomId]);

    useEffect(() => {
        return () => {
            if (successTimeoutRef.current) {
                clearTimeout(successTimeoutRef.current);
            }
        };
    }, []);

    const fetchRoom = async () => {
        try {
            const response = await roomsAPI.getById(roomId);
            const room = response.data;
            setFormData({ roomType: room.roomType || "standard", price: room.price || "", availableRoomsCount: room.availableRoomsCount || 1, amenities: room.amenities || [] });
            setExistingImages(room.images || []);
        } catch (err) {
            setError("Failed to load room");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAmenitiesChange = (amenities) => {
        setFormData({ ...formData, amenities });
    };

    const handleImagesChange = (files) => {
        setImageFiles(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccessMessage("");
        try {
            const submitData = new FormData();
            submitData.append("roomType", formData.roomType);
            submitData.append("price", parseInt(formData.price));
            submitData.append("availableRoomsCount", parseInt(formData.availableRoomsCount));
            submitData.append("amenities", JSON.stringify(formData.amenities));
            if (existingImages.length > 0) { submitData.append("existingImages", JSON.stringify(existingImages)); }
            imageFiles.forEach((file) => { submitData.append("images", file); });
            await roomsAPI.update(roomId, submitData);
            setSuccessMessage("Room updated successfully! Redirecting...");
            successTimeoutRef.current = setTimeout(() => navigate(-1), 1200);
        } catch (error) {
            setError(error.response?.data?.message || "Update failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen">Loading...</div>;

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
            <Navbar />
            {successMessage && (
                <div className="fixed top-24 right-6 z-[60] max-w-sm">
                    <div className="rounded-2xl border border-emerald-200 bg-white/95 backdrop-blur px-5 py-4 shadow-2xl">
                        <p className="text-sm font-semibold text-emerald-700">Success</p>
                        <p className="mt-1 text-sm text-[#0B1F3A]">{successMessage}</p>
                    </div>
                </div>
            )}
            <div className="max-w-3xl mx-auto px-6 py-12"><div className="bg-white rounded-xl border border-gray-200 p-10"><h1 className="text-3xl font-bold text-[#0B1F3A] mb-6">Edit Room</h1><form onSubmit={handleSubmit} className="space-y-6"><div><label className="block font-bold mb-2">Room Type</label><select name="roomType" value={formData.roomType} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2"><option value="standard">Standard</option><option value="AC">AC</option><option value="duplex">Duplex</option></select></div><div className="grid grid-cols-2 gap-4"><div><label className="block font-bold mb-2">Price</label><input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border border-gray-300 rounded px-4 py-2" /></div><div><label className="block font-bold mb-2">Available</label><input type="number" name="availableRoomsCount" value={formData.availableRoomsCount} onChange={handleChange} min="1" className="w-full border border-gray-300 rounded px-4 py-2" /></div></div><div><label className="block font-bold mb-2">Amenities</label><AmenitiesSelector selectedAmenities={formData.amenities} onChange={handleAmenitiesChange} /></div>{error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}<button type="submit" disabled={submitting} className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 font-bold disabled:opacity-50">{submitting ? "Updating..." : "Update Room"}</button></form></div></div>
        </div>
    );
};