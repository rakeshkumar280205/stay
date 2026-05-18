import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomsAPI } from "../api/api";
import { Navbar } from "../components/Navbar";
import { AmenitiesSelector } from "../components/AmenitiesSelector";
import { ImageUploader } from "../components/ImageUploader";

export const AddRoomsPage = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ roomType: "standard", price: "", availableRoomsCount: 1, amenities: [] });
    const [imageFiles, setImageFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const successTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (successTimeoutRef.current) {
                clearTimeout(successTimeoutRef.current);
            }
        };
    }, []);

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
        setLoading(true);
        setError("");
        setSuccessMessage("");
        try {
            const submitData = new FormData();
            submitData.append("hotelId", hotelId);
            submitData.append("roomType", formData.roomType);
            submitData.append("price", parseInt(formData.price));
            submitData.append("availableRoomsCount", parseInt(formData.availableRoomsCount));
            submitData.append("amenities", JSON.stringify(formData.amenities));
            imageFiles.forEach((file) => { submitData.append("images", file); });
            await roomsAPI.create(submitData);
            setSuccessMessage("Room added successfully! Redirecting...");
            successTimeoutRef.current = setTimeout(() => {
                navigate(`/host/rooms/${hotelId}`);
            }, 1200);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to add room");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
            <Navbar />
            {successMessage && (
                <div className="fixed top-24 right-6 z-[60] max-w-sm">
                    <div className="rounded-2xl border border-emerald-200 bg-white/95 backdrop-blur px-5 py-4 shadow-2xl">
                        <p className="text-sm font-semibold text-emerald-700">Success</p>
                        <p className="mt-1 text-sm text-[#0B1F3A]">{successMessage}</p>
                    </div>
                </div>
            )}
            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="bg-white rounded-xl border border-gray-200 p-10">
                    <h1 className="text-4xl font-extrabold text-[#0B1F3A] mb-8">Add Room</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[#0B1F3A] font-bold mb-3">Room Type</label>
                            <select name="roomType" value={formData.roomType} onChange={handleChange} className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl">
                                <option value="standard">Standard</option>
                                <option value="AC">AC</option>
                                <option value="duplex">Duplex</option>
                                <option value="triple">Triple</option>
                                <option value="quadra">Quadra</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[#0B1F3A] font-bold mb-3">Price per Night</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-[#0B1F3A] font-bold mb-3">Available Rooms</label>
                                <input type="number" name="availableRoomsCount" value={formData.availableRoomsCount} onChange={handleChange} min="1" className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[#0B1F3A] font-bold mb-3">Amenities</label>
                            <AmenitiesSelector selectedAmenities={formData.amenities} onChange={handleAmenitiesChange} />
                        </div>
                        <div>
                            <label className="block text-[#0B1F3A] font-bold mb-3">Room Images</label>
                            <ImageUploader images={imageFiles} onImagesChange={handleImagesChange} maxImages={10} />
                        </div>
                        {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}
                        <div className="flex gap-4">
                            <button type="submit" disabled={loading} className="flex-1 bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 font-bold disabled:opacity-50">{loading ? "Adding..." : "Add Room"}</button>
                            <button type="button" onClick={() => navigate(`/host/rooms/${hotelId}`)} className="flex-1 bg-gray-400 text-white py-4 rounded-xl hover:bg-gray-500 font-bold">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};