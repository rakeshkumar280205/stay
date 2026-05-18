import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelsAPI } from "../api/api";
import { Navbar } from "../components/Navbar";
import { LocationAutocomplete } from "../components/LocationAutocomplete";

/**
 * Host - Add Hotel Page
 */
export const AddHotelPage = () => {
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
    const [formData, setFormData] = useState({
        hotelName: "",
        location: "",
        description: "",
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const redirectTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        addImages(files);
    };

    const addImages = (files) => {
        const newFiles = [...imageFiles];
        const newPreviews = [...imagePreviews];

        files.forEach((file) => {
            if (file.type.startsWith("image/")) {
                newFiles.push(file);

                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    setImagePreviews([...newPreviews]);
                };
                reader.readAsDataURL(file);
            }
        });

        setImageFiles(newFiles);
    };

    const handleRemoveImage = (index) => {
        setImageFiles(imageFiles.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
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
        setSuccessMessage("");

        try {
            // Create FormData for multipart/form-data
            const submitData = new FormData();
            submitData.append("hotelName", formData.hotelName);
            submitData.append("location", formData.location);
            submitData.append("description", formData.description);

            // Append all image files
            imageFiles.forEach((file) => {
                submitData.append("images", file);
            });

            await hotelsAPI.create(submitData);
            setSuccessMessage("Hotel created successfully! Redirecting...");
            redirectTimeoutRef.current = setTimeout(() => {
                navigate("/host/dashboard");
            }, 1200);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create hotel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
            <Navbar />

            {successMessage && (
                <div className="fixed top-24 right-6 z-[60] max-w-sm transition-opacity duration-300">
                    <div className="rounded-2xl border border-emerald-200 bg-white/95 backdrop-blur px-5 py-4 shadow-2xl">
                        <p className="text-sm font-semibold text-emerald-700">Success</p>
                        <p className="mt-1 text-sm text-[#0B1F3A]">{successMessage}</p>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl shadow-2xl p-10">
                    <h1 className="text-4xl font-extrabold text-[#0B1F3A] mb-8">✨ Add New Hotel</h1>

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

                            {/* Drag & Drop Upload Area */}
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive
                                    ? "border-[#FF7A00] bg-orange-50"
                                    : "border-gray-300 bg-gray-50 hover:border-[#FF7A00] hover:bg-orange-50"
                                    }`}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    id="image-upload"
                                />
                                <div className="pointer-events-none">
                                    <div className="text-5xl mb-3">📸</div>
                                    <p className="text-[#0B1F3A] font-bold mb-2">
                                        Drag & Drop Images Here
                                    </p>
                                    <p className="text-[#64748B] text-sm mb-3">
                                        or click to browse
                                    </p>
                                    <p className="text-[#64748B] text-xs">
                                        Supports: JPG, PNG, GIF, WEBP (Max 5MB each)
                                    </p>
                                </div>
                            </div>

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-[#0B1F3A] font-bold mb-3">
                                        Selected Images ({imagePreviews.length})
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {imagePreviews.map((preview, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="w-full h-40 object-cover rounded-xl shadow-md border-2 border-gray-200"
                                                />
                                                <button
                                                    onClick={() => handleRemoveImage(idx)}
                                                    type="button"
                                                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full text-sm font-bold hover:bg-red-700 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg"
                                                >
                                                    ✕
                                                </button>
                                                <div className="absolute bottom-2 left-2 bg-[#0B1F3A] bg-opacity-80 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                                    {idx + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && <p className="text-red-600 text-sm bg-red-50 py-3 px-5 rounded-xl font-medium border-l-4 border-red-600">{error}</p>}

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                            >
                                {loading ? "Creating..." : "✅ Create Hotel"}
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
