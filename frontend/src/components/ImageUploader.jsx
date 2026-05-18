import { useState } from "react";

/**
 * ImageUploader Component
 * Multi-image upload with preview, drag & drop support
 */
export const ImageUploader = ({ images, onImagesChange, maxImages = 10 }) => {
    const [dragActive, setDragActive] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        addImages(files);
    };

    const addImages = (files) => {
        const newFiles = [...imageFiles];
        const newPreviews = [...imagePreviews];

        files.forEach((file) => {
            if (file.type.startsWith("image/") && newFiles.length < maxImages) {
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
        onImagesChange(newFiles);
    };

    const handleRemoveImage = (index) => {
        const newFiles = imageFiles.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        setImageFiles(newFiles);
        setImagePreviews(newPreviews);
        onImagesChange(newFiles);
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

    return (
        <div className="space-y-4">
            {/* Drag & Drop Upload Area */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive
                    ? "border-[#FF7A00] bg-gradient-to-br from-orange-50 to-orange-100"
                    : "border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-[#FF7A00] hover:bg-orange-50"
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
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-[#0B1F3A] font-bold text-lg mb-2">
                        Upload Hotel Photos
                    </p>
                    <p className="text-[#64748B] mb-2">
                        Drag & drop images here or click to browse
                    </p>
                    <p className="text-[#64748B] text-sm">
                        Supports: JPG, PNG, GIF, WEBP (Max 5MB each, up to {maxImages} images)
                    </p>
                </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
                <div>
                    <p className="text-[#0B1F3A] font-bold mb-3">
                        📷 Preview ({imagePreviews.length} {imagePreviews.length === 1 ? 'image' : 'images'})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {imagePreviews.map((preview, idx) => (
                            <div key={idx} className="relative group">
                                <img
                                    src={preview}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-full h-40 object-cover rounded-xl shadow-md border-2 border-gray-200 transition-transform duration-300 group-hover:scale-105"
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

            {/* Info Badge */}
            {imagePreviews.length === 0 && (
                <div className="text-center text-[#64748B] text-sm bg-blue-50 py-3 px-4 rounded-xl border border-blue-200">
                    💡 <span className="font-semibold">Tip:</span> Add high-quality images to attract more guests
                </div>
            )}
        </div>
    );
};
