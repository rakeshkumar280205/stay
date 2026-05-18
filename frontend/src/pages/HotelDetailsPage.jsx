import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hotelsAPI, roomsAPI, reviewsAPI } from "../api/api";
import { ImageGallery } from "../components/ImageGallery";
import { Navbar } from "../components/Navbar";

export const HotelDetailsPage = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, [hotelId]);

    const fetchData = async () => {
        setLoading(true);
        setError("");

        try {
            const [hotelResponse, roomsResponse, reviewsResponse] = await Promise.all([
                hotelsAPI.getById(hotelId),
                roomsAPI.getByHotel(hotelId),
                reviewsAPI.getByHotel(hotelId),
            ]);

            setHotel(hotelResponse.data);
            setRooms(Array.isArray(roomsResponse.data) ? roomsResponse.data : []);
            setReviews(Array.isArray(reviewsResponse.data) ? reviewsResponse.data : []);
        } catch (fetchError) {
            setError("Unable to load hotel details. Please try again.");
            console.error("Error loading hotel details:", fetchError);
        } finally {
            setLoading(false);
        }
    };

    const averageRating = useMemo(() => {
        if (!reviews.length) {
            return null;
        }
        const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
        return (total / reviews.length).toFixed(1);
    }, [reviews]);

    const minimumPrice = useMemo(() => {
        if (!rooms.length) {
            return null;
        }
        return Math.min(...rooms.map((room) => Number(room.price || 0)));
    }, [rooms]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[#0B1F3A] text-lg font-semibold">
                Loading hotel details...
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[#0B1F3A] text-lg font-semibold">
                {error || "Hotel not found"}
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
            <Navbar />

            {hotel.images?.length > 0 && (
                <ImageGallery
                    images={hotel.images}
                    altText={hotel.hotelName}
                    variant="hotel"
                />
            )}

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-7 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-[#0B1F3A]">{hotel.hotelName}</h1>
                            <p className="text-[#64748B] mt-2 text-lg">{hotel.location}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {minimumPrice !== null && (
                                <span className="px-4 py-2 rounded-xl bg-[#FFF5EB] border border-[#FFB366] text-[#FF7A00] font-bold">
                                    Starts at Rs {minimumPrice}/night
                                </span>
                            )}
                            <span className="px-4 py-2 rounded-xl bg-[#EEF2FF] border border-[#CBD5E1] text-[#1E293B] font-semibold">
                                {rooms.length} room option{rooms.length === 1 ? "" : "s"}
                            </span>
                            <span className="px-4 py-2 rounded-xl bg-[#ECFEF3] border border-[#BBF7D0] text-[#166534] font-semibold">
                                {averageRating ? `${averageRating}/5 rating` : "No ratings yet"}
                            </span>
                        </div>
                    </div>

                    {hotel.description && (
                        <p className="mt-6 text-[#102A4C] leading-relaxed text-[15px]">
                            {hotel.description}
                        </p>
                    )}
                </div>

                <div className="mt-10">
                    <h2 className="text-3xl font-bold text-[#0B1F3A] mb-5">Choose Your Room</h2>

                    {rooms.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-[#64748B]">
                            No rooms available right now.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {rooms.map((room) => {
                                const isAvailable = Number(room.availableRoomsCount || 0) > 0;

                                return (
                                    <div
                                        key={room._id}
                                        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                                    >
                                        {room.images?.length > 0 && (
                                            <div className="mb-5">
                                                <ImageGallery
                                                    images={room.images}
                                                    altText={`${room.roomType} room`}
                                                    variant="card"
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <h3 className="text-2xl font-bold text-[#0B1F3A] capitalize">
                                                {room.roomType}
                                            </h3>
                                            <p className="text-[#FF7A00] font-extrabold text-2xl">
                                                Rs {room.price}
                                                <span className="text-sm font-medium text-[#64748B]">/night</span>
                                            </p>
                                        </div>

                                        <p className="text-sm text-[#334155] mb-4">
                                            Available rooms: <span className="font-bold">{room.availableRoomsCount || 0}</span>
                                        </p>

                                        <div className="mb-5">
                                            <p className="text-sm font-bold text-[#0B1F3A] mb-2">Amenities</p>
                                            {room.amenities?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {room.amenities.map((amenity, index) => (
                                                        <span
                                                            key={`${room._id}-amenity-${index}`}
                                                            className="text-xs px-3 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155]"
                                                        >
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-[#64748B]">No amenities listed.</p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => navigate(`/booking/${room._id}`)}
                                            disabled={!isAvailable}
                                            className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white py-3.5 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isAvailable ? "Book This Room" : "Sold Out"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-[#0B1F3A] mb-5">Guest Reviews</h2>

                    {reviews.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-[#64748B]">
                            No reviews yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-white rounded-2xl border border-gray-200 p-5">
                                    <p className="font-bold text-[#0B1F3A] mb-1">
                                        {review.userId?.name || "Guest"}
                                        <span className="text-[#64748B] font-medium"> - {review.rating}/5</span>
                                    </p>
                                    <p className="text-[#334155]">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};