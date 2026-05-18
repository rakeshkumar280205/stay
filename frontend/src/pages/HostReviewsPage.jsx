import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelsAPI, reviewsAPI } from "../api/api";
import { Navbar } from "../components/Navbar";

const buildAverageRating = (reviews) => {
    if (!reviews.length) {
        return null;
    }

    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
};

export const HostReviewsPage = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [selectedHotelId, setSelectedHotelId] = useState("");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHotels();
    }, []);

    useEffect(() => {
        if (selectedHotelId) {
            fetchReviews(selectedHotelId);
        } else {
            setReviews([]);
        }
    }, [selectedHotelId]);

    const fetchHotels = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await hotelsAPI.getHostHotels();
            const hotelList = Array.isArray(response.data) ? response.data : [];
            setHotels(hotelList);
            if (hotelList.length > 0) {
                setSelectedHotelId(hotelList[0]._id);
            }
        } catch (fetchError) {
            console.error("Error fetching host hotels:", fetchError);
            setError("Failed to load your hotels.");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (hotelId) => {
        setReviewsLoading(true);
        setError("");

        try {
            const response = await reviewsAPI.getByHotel(hotelId);
            setReviews(Array.isArray(response.data) ? response.data : []);
        } catch (fetchError) {
            console.error("Error fetching hotel reviews:", fetchError);
            setError("Failed to load reviews for this hotel.");
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    const selectedHotel = useMemo(
        () => hotels.find((hotel) => hotel._id === selectedHotelId) || null,
        [hotels, selectedHotelId]
    );

    const reviewSummary = useMemo(() => {
        return {
            averageRating: buildAverageRating(reviews),
            reviewCount: reviews.length,
        };
    }, [reviews]);

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-[#0B1F3A] mb-2">Guest Reviews</h1>
                        <p className="text-[#64748B]">See guest ratings, comments, and user names for your hotels.</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/host/dashboard")}
                        className="w-fit bg-[#0B1F3A] text-white px-5 py-3 rounded-xl font-semibold"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {loading ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-[#64748B]">
                        Loading your hotels...
                    </div>
                ) : hotels.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                        <p className="text-[#64748B] mb-4">You do not have any hotels yet.</p>
                        <button
                            type="button"
                            onClick={() => navigate("/host/add-hotel")}
                            className="bg-[#FF7A00] text-white px-5 py-3 rounded-xl font-semibold"
                        >
                            Add Hotel
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
                            <label className="block text-sm font-bold text-[#0B1F3A] mb-3">Select Hotel</label>
                            <select
                                value={selectedHotelId}
                                onChange={(e) => setSelectedHotelId(e.target.value)}
                                className="w-full md:w-96 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]"
                            >
                                {hotels.map((hotel) => (
                                    <option key={hotel._id} value={hotel._id}>
                                        {hotel.hotelName} - {hotel.location}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedHotel && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                    <p className="text-xs uppercase tracking-wide text-[#64748B] font-semibold mb-2">Hotel</p>
                                    <p className="text-xl font-bold text-[#0B1F3A]">{selectedHotel.hotelName}</p>
                                    <p className="text-sm text-[#64748B] mt-1">{selectedHotel.location}</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                    <p className="text-xs uppercase tracking-wide text-[#64748B] font-semibold mb-2">Average Rating</p>
                                    <p className="text-3xl font-bold text-[#0B1F3A]">
                                        {reviewSummary.averageRating ? `${reviewSummary.averageRating}/5` : "No ratings yet"}
                                    </p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                    <p className="text-xs uppercase tracking-wide text-[#64748B] font-semibold mb-2">Reviews</p>
                                    <p className="text-3xl font-bold text-[#0B1F3A]">{reviewSummary.reviewCount}</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[#0B1F3A]">Hotel Reviews</h2>
                                <span className="text-sm text-[#64748B]">
                                    {reviews.length} review{reviews.length === 1 ? "" : "s"}
                                </span>
                            </div>

                            {reviewsLoading ? (
                                <div className="text-[#64748B]">Loading reviews...</div>
                            ) : error ? (
                                <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
                                    {error}
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-12 rounded-xl bg-[#F8FAFC] border border-gray-200">
                                    <p className="text-[#64748B] text-lg">No reviews for this hotel yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="rounded-2xl border border-gray-200 p-5 bg-[#F8FAFC]">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                                <div>
                                                    <p className="text-lg font-bold text-[#0B1F3A]">
                                                        {review.userId?.name || "Guest"}
                                                    </p>
                                                    <p className="text-sm text-[#64748B] mt-1">
                                                        {review.roomId?.roomType ? `${review.roomId.roomType} room` : "Room review"}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-[#FF7A00] font-extrabold text-2xl">{review.rating}/5</p>
                                                    <p className="text-xs text-[#64748B]">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="mt-4 text-[#334155] leading-relaxed">{review.comment}</p>

                                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#64748B]">
                                                {review.userId?.phone && (
                                                    <span className="px-3 py-1 rounded-full bg-white border border-gray-200">
                                                        {review.userId.phone}
                                                    </span>
                                                )}
                                                {review.roomId?.roomType && (
                                                    <span className="px-3 py-1 rounded-full bg-white border border-gray-200 capitalize">
                                                        {review.roomId.roomType}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
