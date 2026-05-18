import { useState } from "react";
import { createPortal } from "react-dom";

/**
 * Image Lightbox Component - Full screen image viewer
 */
const ImageLightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
    return (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-all duration-300 hover:scale-110 z-10"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
                <button
                    onClick={onPrev}
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-all duration-300 hover:scale-110"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Image */}
            <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <img
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
                <button
                    onClick={onNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-all duration-300 hover:scale-110"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Counter */}
            {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 text-white px-6 py-3 rounded-full font-bold backdrop-blur-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>
    );
};

/**
 * Image Gallery Component - Grid of thumbnails with lightbox
 */
export const ImageGallery = ({
    images,
    altText = "Image",
    variant = "hotel",
    allowLightbox = true,
    mainHeightClassName = "h-96 md:h-[500px]",
}) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!images || images.length === 0) {
        return null;
    }

    const openLightbox = (index) => {
        if (!allowLightbox) {
            return;
        }
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Hotel variant - Large main image with thumbnails
    if (variant === "hotel" && images.length > 0) {
        return (
            <div className="bg-white">
                {/* Main Large Image */}
                <div className={`relative ${mainHeightClassName} bg-gray-900 overflow-hidden group${allowLightbox ? " cursor-pointer" : ""}`}
                    onClick={() => openLightbox(0)}
                >
                    <img
                        src={images[0]}
                        alt={altText}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                    <div className="absolute bottom-6 right-6 bg-black/60 text-white px-4 py-2 rounded-full font-bold backdrop-blur-sm">
                        🖼️ {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
                    </div>
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => openLightbox(index)}
                                    className={`relative aspect-square rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300${allowLightbox ? " cursor-pointer" : ""}`}
                                >
                                    <img
                                        src={image}
                                        alt={`${altText} ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lightbox */}
                {allowLightbox && lightboxOpen &&
                    createPortal(
                        <ImageLightbox
                            images={images}
                            currentIndex={currentImageIndex}
                            onClose={closeLightbox}
                            onNext={nextImage}
                            onPrev={prevImage}
                        />,
                        document.body
                    )}
            </div>
        );
    }

    // Card variant - Small preview with click to enlarge
    if (variant === "card") {
        return (
            <>
                <div className={`relative overflow-hidden rounded-xl group${allowLightbox ? " cursor-pointer" : ""}`}
                    onClick={() => openLightbox(0)}
                >
                    <img
                        src={images[0]}
                        alt={altText}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {images.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
                            +{images.length - 1}
                        </div>
                    )}
                    {allowLightbox && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-[#0B1F3A] px-4 py-2 rounded-full font-bold">
                                🔍 View
                            </div>
                        </div>
                    )}
                </div>

                {/* Lightbox */}
                {allowLightbox && lightboxOpen &&
                    createPortal(
                        <ImageLightbox
                            images={images}
                            currentIndex={currentImageIndex}
                            onClose={closeLightbox}
                            onNext={nextImage}
                            onPrev={prevImage}
                        />,
                        document.body
                    )}
            </>
        );
    }

    // Card grid variant - Compact 2x2 preview
    if (variant === "cardGrid") {
        return (
            <>
                <div className={`grid grid-cols-2 gap-1 h-48 rounded-xl overflow-hidden${allowLightbox ? " cursor-pointer" : ""}`}>
                    {images.slice(0, 4).map((image, index) => (
                        <div
                            key={index}
                            onClick={() => openLightbox(index)}
                            className={`relative w-full h-full overflow-hidden${allowLightbox ? " cursor-pointer" : ""}`}
                        >
                            <img
                                src={image}
                                alt={`${altText} ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {index === 3 && images.length > 4 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-bold">
                                    +{images.length - 4}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {allowLightbox && lightboxOpen &&
                    createPortal(
                        <ImageLightbox
                            images={images}
                            currentIndex={currentImageIndex}
                            onClose={closeLightbox}
                            onNext={nextImage}
                            onPrev={prevImage}
                        />,
                        document.body
                    )}
            </>
        );
    }

    // Grid variant - Multiple visible images
    if (variant === "grid") {
        return (
            <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.slice(0, 6).map((image, index) => (
                        <div
                            key={index}
                            onClick={() => openLightbox(index)}
                            className={`relative aspect-square rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300${allowLightbox ? " cursor-pointer" : ""}`}
                        >
                            <img
                                src={image}
                                alt={`${altText} ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {allowLightbox && (
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-[#0B1F3A] px-4 py-2 rounded-full font-bold">
                                        🔍 View
                                    </div>
                                </div>
                            )}
                            {index === 5 && images.length > 6 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold">
                                    +{images.length - 6}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Lightbox */}
                {allowLightbox && lightboxOpen &&
                    createPortal(
                        <ImageLightbox
                            images={images}
                            currentIndex={currentImageIndex}
                            onClose={closeLightbox}
                            onNext={nextImage}
                            onPrev={prevImage}
                        />,
                        document.body
                    )}
            </>
        );
    }

    return null;
};
