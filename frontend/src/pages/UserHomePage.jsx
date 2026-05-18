import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hotelsAPI } from "../api/api";
import { HotelCard } from "../components/Cards";
import { Navbar } from "../components/Navbar";
import { SearchAutocomplete } from "../components/SearchAutocomplete";
import { ImageGallery } from "../components/ImageGallery";

/**
 * User - Home Page with MakeMyTrip-style Search
 */
export const UserHomePage = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000 });
    const [selectedTrip, setSelectedTrip] = useState(null);

    useEffect(() => {
        fetchHotels();
    }, []);

    useEffect(() => {
        const query = searchTerm.toLowerCase();
        const filtered = hotels.filter((hotel) => {
            const name = (hotel.hotelName || "").toLowerCase();
            const location = (hotel.location || "").toLowerCase();
            const matchesQuery = name.includes(query) || location.includes(query);

            const price =
                typeof hotel.pricePerNight === "number"
                    ? hotel.pricePerNight
                    : typeof hotel.minPrice === "number"
                        ? hotel.minPrice
                        : null;
            const matchesPrice =
                price === null
                    ? true
                    : price >= priceFilter.min && price <= priceFilter.max;

            return matchesQuery && matchesPrice;
        });
        setFilteredHotels(filtered);
    }, [searchTerm, hotels, priceFilter]);

    const fetchHotels = async () => {
        try {
            const response = await hotelsAPI.getAll();
            setHotels(response.data);
            setFilteredHotels(response.data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        } finally {
            setLoading(false);
        }
    };

    const tripTypes = [
        { id: 'weekend', label: '🏖️ Weekend Stay', description: 'Friday - Sunday' },
        { id: 'business', label: '💼 Business Trip', description: 'Mon - Fri' },
        { id: 'family', label: '👨‍👩‍👧‍👦 Family Friendly', description: 'All amenities' },
        { id: 'luxury', label: '✨ Luxury', description: 'Premium stays' },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
            <Navbar />

            {/* Hero Section with Enhanced Search */}
            <div className="relative bg-gradient-to-br from-[#0B1F3A] via-[#102A4C] to-[#173B6C] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 py-16">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-white to-[#E2E8F0] bg-clip-text text-transparent">
                            Find Your Perfect Stay
                        </h2>
                        <p className="text-[#E2E8F0] text-xl">
                            Discover amazing hotels at unbeatable prices
                        </p>
                    </div>

                    {/* Trip Type Quick Select */}
                    <div className="mb-8 flex flex-wrap gap-3 justify-center">
                        {tripTypes.map((trip) => (
                            <button
                                key={trip.id}
                                onClick={() => setSelectedTrip(trip.id)}
                                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${selectedTrip === trip.id
                                    ? 'bg-[#FF7A00] text-white shadow-xl scale-105'
                                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                                    }`}
                            >
                                <div className="text-sm">{trip.label}</div>
                                <div className="text-xs opacity-80">{trip.description}</div>
                            </button>
                        ))}
                    </div>

                    {/* Premium Search Card */}
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-bold text-[#0B1F3A] mb-2">📍 Location</label>
                                    <SearchAutocomplete
                                        value={searchTerm}
                                        onChange={setSearchTerm}
                                        onSelect={(suggestion) => {
                                            setSearchTerm(suggestion.text);
                                            // If hotel selected, navigate to hotel details
                                            if (suggestion.type === "hotel" && suggestion.hotelId) {
                                                navigate(`/hotel/${suggestion.hotelId}`);
                                            }
                                        }}
                                        placeholder="City or Hotel name"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
                                    />
                                </div>

                                {/* Search Button */}
                                <button className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105">
                                    🔍 Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters + Hotels Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-[#0B1F3A] mb-6 pb-4 border-b-2 border-[#FF7A00]">🎯 Filters</h3>

                            {/* Price Range */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-[#0B1F3A] mb-3">💰 Price Range</label>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="100"
                                        value={priceFilter.max}
                                        onChange={(e) => setPriceFilter({ ...priceFilter, max: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, #FF7A00 0%, #FF7A00 ${(priceFilter.max / 10000) * 100}%, #e0e0e0 ${(priceFilter.max / 10000) * 100}%, #e0e0e0 100%)`
                                        }}
                                    />
                                    <div className="text-sm text-[#64748B]">₹0 - ₹{priceFilter.max}</div>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-[#0B1F3A] mb-3">✨ Amenities</label>
                                <div className="space-y-2">
                                    {['WiFi', 'Pool', 'AC', 'Parking'].map(amenity => (
                                        <label key={amenity} className="flex items-center gap-3 cursor-pointer hover:text-[#FF7A00] transition-colors">
                                            <input type="checkbox" className="w-4 h-4 rounded accent-[#FF7A00]" />
                                            <span className="text-sm">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Free Cancellation */}
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer hover:text-[#FF7A00] transition-colors">
                                    <input type="checkbox" className="w-4 h-4 rounded accent-[#FF7A00]" />
                                    <span className="text-sm font-semibold text-[#0B1F3A]">Free Cancellation</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Hotels Grid */}
                    <div className="lg:col-span-4">
                        {loading ? (
                            <div className="flex items-center justify-center h-64 text-[#64748B] text-lg">⏳ Loading amazing hotels...</div>
                        ) : filteredHotels.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                                <p className="text-[#64748B] text-xl">🏨 No hotels found matching your criteria</p>
                                <p className="text-[#64748B] text-sm mt-2">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredHotels.map((hotel) => (
                                    <div
                                        key={hotel._id}
                                        onClick={() => navigate(`/hotel/${hotel._id}`)}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex"
                                    >
                                        {/* Hotel Image */}
                                        {hotel.images && hotel.images.length > 0 && (
                                            <div className="w-64 flex-shrink-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                                                <ImageGallery
                                                    images={hotel.images}
                                                    altText={hotel.hotelName}
                                                    variant="cardGrid"
                                                />
                                            </div>
                                        )}

                                        {/* Hotel Info */}
                                        <div className="flex-1 p-6 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="text-2xl font-bold text-[#0B1F3A]">{hotel.hotelName}</h4>
                                                        <p className="text-[#64748B] text-sm flex items-center gap-2 mt-1">
                                                            <span>📍</span> {hotel.location}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className="text-xs text-[#64748B]">Real reviews shown on details</span>
                                                    </div>
                                                </div>
                                                <p className="text-[#102A4C] text-sm line-clamp-2 mb-4">{hotel.description}</p>
                                            </div>

                                            {/* Price and CTA */}
                                            <div className="flex items-center justify-between">
                                                <div className="text-[#FF7A00] font-bold">
                                                    <span className="text-2xl">
                                                        {hotel.minPrice != null ? `₹ ${hotel.minPrice}` : "₹ —"}
                                                    </span>
                                                    <span className="text-sm text-[#64748B] ml-2">/night</span>
                                                </div>
                                                <button className="bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105">
                                                    View Rooms →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
