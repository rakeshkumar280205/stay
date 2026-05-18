import { useState, useEffect, useRef } from "react";
import axios from "axios";

/**
 * SearchAutocomplete Component
 * Provides live search suggestions with debouncing
 */
export const SearchAutocomplete = ({
    value,
    onChange,
    onSelect,
    placeholder = "Search hotels or locations...",
    className = ""
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const debounceTimer = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch suggestions with debouncing
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (value && value.trim().length > 0) {
            setLoading(true);
            debounceTimer.current = setTimeout(() => {
                fetchSuggestions(value);
            }, 300); // 300ms debounce
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            setLoading(false);
        }

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [value]);

    const fetchSuggestions = async (query) => {
        try {
            const response = await axios.get(`/api/search/suggestions?q=${encodeURIComponent(query)}`, {
                withCredentials: true,
            });
            setSuggestions(response.data.suggestions || []);
            setShowSuggestions(true);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
            setLoading(false);
        }
    };

    const handleSelect = (suggestion) => {
        onSelect(suggestion);
        setShowSuggestions(false);
        setHighlightIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
                handleSelect(suggestions[highlightIndex]);
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
            setHighlightIndex(-1);
        }
    };

    const highlightMatch = (text, query) => {
        if (!query) return text;

        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <span>
                {parts.map((part, index) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                        <span key={index} className="font-bold text-[#FF7A00]">{part}</span>
                    ) : (
                        <span key={index}>{part}</span>
                    )
                )}
            </span>
        );
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder={placeholder}
                className={className}
                autoComplete="off"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#0B1F3A] to-[#173B6C] rounded-xl shadow-2xl border-2 border-[#FF7A00]/40 max-h-80 overflow-y-auto z-50">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(suggestion)}
                            onMouseEnter={() => setHighlightIndex(index)}
                            className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${index === highlightIndex
                                ? "bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white"
                                : "hover:bg-[#102A4C] text-white"
                                } ${index === 0 ? "rounded-t-xl" : ""} ${index === suggestions.length - 1 ? "rounded-b-xl" : "border-b border-white/10"
                                }`}
                        >
                            {/* Icon */}
                            <span className="text-2xl flex-shrink-0">
                                {suggestion.icon}
                            </span>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className={`font-semibold truncate ${index === highlightIndex ? "text-white" : "text-white"
                                    }`}>
                                    {highlightMatch(suggestion.text, value)}
                                </div>
                                {suggestion.location && suggestion.type === "hotel" && (
                                    <div className={`text-sm truncate ${index === highlightIndex ? "text-white/90" : "text-white/70"
                                        }`}>
                                        📍 {suggestion.location}
                                    </div>
                                )}
                            </div>

                            {/* Hotel Image (if available) */}
                            {suggestion.image && suggestion.type === "hotel" && (
                                <img
                                    src={suggestion.image}
                                    alt={suggestion.text}
                                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                />
                            )}

                            {/* Type Badge */}
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${index === highlightIndex
                                ? "bg-white/20 text-white"
                                : suggestion.type === "location"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}>
                                {suggestion.type === "location" ? "Location" : "Hotel"}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* No Results */}
            {showSuggestions && !loading && suggestions.length === 0 && value.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#0B1F3A] to-[#173B6C] rounded-xl shadow-2xl border-2 border-[#FF7A00]/40 px-4 py-6 text-center z-50 text-white">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-white font-medium">No results found</p>
                    <p className="text-white/70 text-sm">Try a different search term</p>
                </div>
            )}
        </div>
    );
};
