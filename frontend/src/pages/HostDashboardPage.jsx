import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hotelsAPI, reviewsAPI } from "../api/api";
import { Navbar } from "../components/Navbar";
import { ImageGallery } from "../components/ImageGallery";

export const HostDashboardPage = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [reviewInsightsByHotel, setReviewInsightsByHotel] = useState({});
    const [loading, setLoading] = useState(true);
    const [deleteState, setDeleteState] = useState({
        open: false,
        hotelId: "",
        hotelName: "",
    });
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        fetchHostHotels();
    }, []);

    const fetchHostHotels = async () => {
        try {
            const response = await hotelsAPI.getHostHotels();
            const hotelList = Array.isArray(response.data) ? response.data : [];
            setHotels(hotelList);
            await fetchReviewInsights(hotelList);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviewInsights = async (hotelList) => {
        if (!hotelList.length) {
            setReviewInsightsByHotel({});
            return;
        }

        try {
            const insights = await Promise.all(
                hotelList.map(async (hotel) => {
                    const response = await reviewsAPI.getByHotel(hotel._id);
                    const reviews = Array.isArray(response.data) ? response.data : [];

                    const averageRating = reviews.length
                        ? (
                            reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
                            reviews.length
                        ).toFixed(1)
                        : null;

                    return [
                        hotel._id,
                        {
                            count: reviews.length,
                            averageRating,
                            latestComment: reviews[0]?.comment || "",
                        },
                    ];
                })
            );

            setReviewInsightsByHotel(Object.fromEntries(insights));
        } catch (error) {
            console.error("Error fetching review insights:", error);
        }
    };

    const openDeleteModal = (hotel) => {
        setActionError("");
        setDeleteState({
            open: true,
            hotelId: hotel._id,
            hotelName: hotel.hotelName || "this hotel",
        });
    };

    const closeDeleteModal = () => {
        if (actionLoading) {
            return;
        }
        setDeleteState({
            open: false,
            hotelId: "",
            hotelName: "",
        });
    };

    const handleDelete = async () => {
        if (!deleteState.hotelId) {
            setActionError("Invalid hotel selected.");
            return;
        }

        setActionLoading(true);
        setActionError("");
        try {
            await hotelsAPI.delete(deleteState.hotelId);
            closeDeleteModal();
            await fetchHostHotels();
        } catch (error) {
            setActionError(error.response?.data?.message || "Delete failed.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {deleteState.open && (
                <div className="fixed inset-0 z-50 bg-[#0B1F3A]/50 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-2">Delete hotel</h2>
                        <p className="text-[#475569] mb-4">
                            Are you sure you want to delete <span className="font-semibold">{deleteState.hotelName}</span>?
                        </p>

                        {actionError && (
                            <p className="text-red-600 text-sm bg-red-50 py-2.5 px-3 rounded-xl border border-red-200 mb-4">
                                {actionError}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                disabled={actionLoading}
                                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-[#0B1F3A] font-semibold disabled:opacity-60"
                            >
                                Keep hotel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={actionLoading}
                                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 rounded-xl font-semibold disabled:opacity-60"
                            >
                                {actionLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-12">
                {!deleteState.open && actionError && (
                    <p className="text-red-600 text-sm bg-red-50 py-2.5 px-3 rounded-xl border border-red-200 mb-6">
                        {actionError}
                    </p>
                )}

                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-5xl font-extrabold text-black mb-2">My Hotels</h1>
                        <p className="text-gray-600 text-lg">Manage your hotel properties</p>
                    </div>
                    <button
                        onClick={() => navigate("/host/add-hotel")}
                        className="bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-800 font-bold transition-colors text-lg"
                    >
                        Add Hotel
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64 text-[#64748B]">Loading...</div>
                ) : hotels.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
                        <p className="text-[#64748B] text-xl mb-8">No hotels yet</p>
                        <button
                            onClick={() => navigate("/host/add-hotel")}
                            className="bg-gray-900 text-white px-10 py-4 rounded-xl hover:bg-gray-800 font-bold transition-colors"
                        >
                            Create Your First Hotel
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hotels.map((hotel) => (

                            <div
                                key={hotel._id}
                                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md cursor-pointer"
                                onClick={() => navigate(`/host/rooms/${hotel._id}`)}
                            >
                                {hotel.images && hotel.images.length > 0 && (
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <ImageGallery images={hotel.images} altText={hotel.hotelName} variant="card" />
                                    </div>
                                )}

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-[#0B1F3A] mb-2 line-clamp-2">{hotel.hotelName}</h3>
                                    <p className="text-[#64748B] text-sm mb-4">{hotel.location}</p>
                                    <p className="text-[#64748B] text-sm mb-6 line-clamp-2">{hotel.description}</p>

                                    <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-[#F8FAFC]">
                                        <p className="text-xs text-[#64748B] font-semibold uppercase tracking-wide mb-1">
                                            Guest Reviews
                                        </p>
                                        <p className="text-sm text-[#0B1F3A] font-bold">
                                            {reviewInsightsByHotel[hotel._id]?.averageRating
                                                ? `${reviewInsightsByHotel[hotel._id].averageRating}/5 average`
                                                : "No ratings yet"}
                                        </p>
                                        <p className="text-xs text-[#64748B] mt-1">
                                            {reviewInsightsByHotel[hotel._id]?.count || 0} review{(reviewInsightsByHotel[hotel._id]?.count || 0) === 1 ? "" : "s"}
                                        </p>
                                        {reviewInsightsByHotel[hotel._id]?.latestComment && (
                                            <p className="text-xs text-[#334155] mt-2 line-clamp-2">
                                                Latest: {reviewInsightsByHotel[hotel._id].latestComment}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-6 pb-6 border-b border-gray-200">
                                        <p className="text-sm text-[#64748B] font-medium mb-1">Starting From</p>
                                        <p className="text-2xl font-bold text-[#0B1F3A]">{hotel.minPrice != null ? `₹${hotel.minPrice}` : "₹—"}/night</p>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate("/host/reviews");
                                            }}
                                            className="flex-1 bg-[#FF7A00] text-white px-4 py-3 rounded-lg text-sm hover:bg-[#e96f00] font-bold"
                                        >
                                            Reviews
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); navigate(`/host/edit-hotel/${hotel._id}`); }} className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-blue-700 font-bold">Edit</button>
                                        <button onClick={(e) => { e.stopPropagation(); navigate(`/host/add-rooms/${hotel._id}`); }} className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm hover:bg-gray-800 font-bold">Rooms</button>
                                        <button onClick={(e) => { e.stopPropagation(); openDeleteModal(hotel); }} className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-red-700 font-bold">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};