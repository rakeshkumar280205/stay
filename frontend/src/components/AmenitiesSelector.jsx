import { useState } from "react";
import { AMENITIES_LIST } from "../constants/amenities";

/**
 * AmenitiesSelector Component
 * Checkbox-based amenities selection with modern UI
 */
export const AmenitiesSelector = ({ selectedAmenities, onChange }) => {
    const handleToggle = (amenity) => {
        if (selectedAmenities.includes(amenity)) {
            onChange(selectedAmenities.filter((item) => item !== amenity));
        } else {
            onChange([...selectedAmenities, amenity]);
        }
    };

    return (
        <div className="space-y-4">
            {/* Checkbox Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES_LIST.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                        <label
                            key={amenity}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 border-2 ${isSelected
                                    ? "bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white border-[#FF7A00] shadow-lg scale-105"
                                    : "bg-white text-[#0B1F3A] border-gray-200 hover:border-[#FF7A00] hover:bg-orange-50"
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggle(amenity)}
                                className="sr-only"
                            />
                            <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected
                                        ? "bg-white border-white"
                                        : "bg-gray-50 border-gray-300"
                                    }`}
                            >
                                {isSelected && (
                                    <svg
                                        className="w-4 h-4 text-[#FF7A00]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </div>
                            <span className="font-semibold text-sm">{amenity}</span>
                        </label>
                    );
                })}
            </div>

            {/* Selected Amenities Preview */}
            {selectedAmenities.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-br from-[#FFF5EB] to-[#FFEDD5] rounded-xl border-2 border-[#FFA94D]/30">
                    <p className="text-[#0B1F3A] font-bold mb-3 text-sm">
                        ✨ Selected Amenities ({selectedAmenities.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {selectedAmenities.map((amenity) => (
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
        </div>
    );
};
