import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hotelsAPI } from "../api/api";
import { Navbar } from "../components/Navbar";
import { LocationAutocomplete } from "../components/LocationAutocomplete";

/**
 * Host - Edit Hotel Page
 */
export const EditHotelPage = () => {
    const CITY_OPTIONS = [
        "Mumbai",
        "Delhi",
        "Bengaluru",
        "Hyderabad",
        "Chennai",
        "Kolkata",
        "Pune",
        "Ahmedabad",
        "Jaipur",
        "Surat",
        "Lucknow",
        "Kanpur",
        "Nagpur",
        "Indore",
        "Bhopal",
        "Patna",
        "Chandigarh",
        "Kochi",
        "Thiruvananthapuram",
        "Goa",
    ];
    const navigate = useNavigate();
    const { hotelId } = useParams();
    const [formData, setFormData] = useState({
        hotelName: "",
        location: "",
        description: "",
        amenities: [],
    });
    const [existingImages, setExistingImages] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [error, setError] = useState("");
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        fetchHotelData();
    }, [hotelId]);

    const fetchHotelData = async () => {
        setFetchLoading(true);
        setFetchError("");
        if (!hotelId) {
            setFetchError("Hotel ID is missing in the URL.");
            setFetchLoading(false);
            return;
        }
        try {
            const response = await hotelsAPI.getById(hotelId);
            const hotel = response.data;

            setFormData({
                hotelName: hotel.hotelName || "",
                location: hotel.location || "",
                description: hotel.description || "",
                amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
            });
            setExistingImages(hotel.images || []);
        } catch (error) {
            const status = error?.response?.status;
            if (status === 403) {
                setFetchError("You are not authorized to edit this hotel.");
            } else if (status === 404) {
                setFetchError("Hotel not found.");
            } else {
                setFetchError("Failed to load hotel data. Please try again.");
            }
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        addImages(files);
    };

    const addImages = (files) => {
        const newFiles = [...newImageFiles];
        const newPreviews = [...newImagePreviews];

        files.forEach((file) => {
            if (file.type.startsWith("image/")) {
                newFiles.push(file);

                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    setNewImagePreviews([...newPreviews]);
                };
                reader.readAsDataURL(file);
            }
        });

        setNewImageFiles(newFiles);
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const handleRemoveNewImage = (index) => {
        setNewImageFiles(newImageFiles.filter((_, i) => i !== index));
        setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            addImages(files);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const submitData = new FormData();
            submitData.append("hotelName", formData.hotelName);
            submitData.append("location", formData.location);
            submitData.append("description", formData.description);

            // Send existing images as JSON string
            submitData.append("existingImages", JSON.stringify(existingImages));

            // Append new image files
            newImageFiles.forEach((file) => {
                submitData.append("images", file);
            });

            await hotelsAPI.update(hotelId, submitData);
            navigate("/host/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to update hotel");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
                <Navbar />
                <div className="max-w-3xl mx-auto px-6 py-12">
                    <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
                        <div className="text-6xl mb-4">⏳</div>
                        <div className="text-[#0B1F3A] text-xl font-bold">Loading hotel details...</div>
                        <div className="mt-4 w-10 h-10 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
                <Navbar />
                <div className="max-w-3xl mx-auto px-6 py-12">
                    <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <div className="text-[#0B1F3A] text-xl font-bold mb-3">{fetchError}</div>
                        <p className="text-[#64748B] mb-6">Check your connection or try again.</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                type="button"
                                onClick={fetchHotelData}
                                className="bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                🔄 Retry
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/host/dashboard")}
                                className="bg-gray-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                            >
                                ← Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl shadow-2xl p-10">
                    <h1 className="text-4xl font-extrabold text-[#0B1F3A] mb-8">✏️ Edit Hotel</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[#0B1F3A] font-bold mb-3">🏨 Hotel Name</label>
                            <input
                                type="text"
                                name="hotelName"
                                value={formData.hotelName}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all duration-300 bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-[#0B1F3A] font-bold mb-3">📍 Location</label>
                            <LocationAutocomplete
                                value={formData.location}
                                onChange={(value) =>
                                    setFormData({ ...formData, location: value })
                                }
                                options={CITY_OPTIONS}
                                placeholder="Select or type a city"
                                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all duration-300 bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-[#0B1F3A] font-bold mb-3">📝 Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all duration-300 bg-gray-50 focus:bg-white"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-[#0B1F3A] font-bold mb-3">🖼️ Hotel Images</label>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-[#0B1F3A] font-semibold mb-3 text-sm">
                                        Current Images ({existingImages.length})
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {existingImages.map((imageUrl, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Existing ${idx + 1}`}
                                                    className="w-full h-40 object-cover rounded-xl shadow-md border-2 border-green-200"
                                                />
                                                <button
                                                    onClick={() => handleRemoveExistingImage(idx)}
                                                    type="button"
                                                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full text-sm font-bold hover:bg-red-700 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg"
                                                >
                                                    ✕
                                                </button>
                                                <div className="absolute bottom-2 left-2 bg-green-600 bg-opacity-90 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                                    Saved
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {existingImages.length === 0 && (
                                <div className="mb-6 text-center text-[#64748B] text-sm bg-blue-50 py-4 px-5 rounded-xl border border-blue-200">
                                    No saved images yet. Add some below.
                                </div>
                            )}

                            {/* Drag & Drop Upload Area for New Images */}
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive
                                    ? "border-[#FF7A00] bg-gradient-to-br from-[#0B1F3A] to-[#173B6C] text-white"
                                    : "border-gray-300 bg-gradient-to-br from-[#0B1F3A] to-[#102A4C] text-white hover:border-[#FF7A00]"
                                    }`}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="pointer-events-none">
                                    <div className="text-5xl mb-3">📸</div>
                                    <p className="font-bold mb-2">
                                        Add More Images
                                    </p>
                                    <p className="text-white/80 text-sm mb-3">
                                        Drag & drop or click to browse
                                    </p>
                                    <p className="text-white/70 text-xs">
                                        Supports: JPG, PNG, GIF, WEBP (Max 5MB each)
                                    </p>
                                </div>
                            </div>

                            {/* New Image Previews */}
                            {newImagePreviews.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-[#0B1F3A] font-semibold mb-3 text-sm">
                                        New Images to Upload ({newImagePreviews.length})
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {newImagePreviews.map((preview, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`New ${idx + 1}`}
                                                    className="w-full h-40 object-cover rounded-xl shadow-md border-2 border-orange-200"
                                                />
                                                <button
                                                    onClick={() => handleRemoveNewImage(idx)}
                                                    type="button"
                                                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full text-sm font-bold hover:bg-red-700 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg"
                                                >
                                                    ✕
                                                </button>
                                                <div className="absolute bottom-2 left-2 bg-orange-600 bg-opacity-90 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                                    New
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {formData.amenities.length > 0 && (
                            <div className="bg-gradient-to-br from-[#FFF5EB] to-[#FFEDD5] rounded-xl border-2 border-[#FFA94D]/30 p-4">
                                <p className="text-[#0B1F3A] font-bold mb-3 text-sm">✨ Amenities</p>
                                <div className="flex flex-wrap gap-2">
                                    {formData.amenities.map((amenity) => (
                                        <span
                                            key={amenity}
                                            className="bg-white text-[#FF7A00] px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm border border-[#FF7A00]/30"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="text-red-600 text-sm bg-red-50 py-3 px-5 rounded-xl font-medium border-l-4 border-red-600">
                                {error}
                            </p>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                            >
                                {loading ? "Uploading..." : "💾 Update Hotel"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/host/dashboard")}
                                className="flex-1 bg-gray-400 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-500 transition-all duration-300 hover:scale-105"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
