import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingsAPI, reviewsAPI } from "../api/api";
import { Navbar } from "../components/Navbar";

const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffMs = end - start;
    const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
};

const calculateTotalPrice = (booking) => {
    const nights = calculateNights(booking.checkIn, booking.checkOut);
    const nightlyPrice = Number(booking.roomId?.price || 0);
    return nights * nightlyPrice;
};

const canReviewBooking = (booking) => {
    return booking.status === "approved";
};

export const MyBookingsPage = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionSubmitting, setActionSubmitting] = useState(false);
    const [actionError, setActionError] = useState("");
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        action: "",
        targetId: "",
        title: "",
        message: "",
        confirmLabel: "Confirm",
        cancelLabel: "Cancel",
    });
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        bookingId: "",
        rating: 5,
        comment: "",
    });

    const reviewByBookingId = useMemo(() => {
        return myReviews.reduce((acc, review) => {
            acc[review.bookingId] = review;
            return acc;
        }, {});
    }, [myReviews]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bookingsResponse, reviewsResponse] = await Promise.all([
                bookingsAPI.getMyBookings(),
                reviewsAPI.getMyReviews(),
            ]);

            setBookings(bookingsResponse.data);
            setMyReviews(reviewsResponse.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const openCancelModal = (bookingId) => {
        setActionError("");
        setConfirmModal({
            open: true,
            action: "cancel-booking",
            targetId: bookingId,
            title: "Cancel booking",
            message: "Are you sure you want to cancel this booking?",
            confirmLabel: "Yes, cancel",
            cancelLabel: "Keep booking",
        });
    };

    const closeConfirmModal = () => {
        if (actionSubmitting) {
            return;
        }
        setConfirmModal((prev) => ({ ...prev, open: false }));
        setActionError("");
    };

    const handleConfirmAction = async () => {
        if (!confirmModal.targetId) {
            setActionError("Invalid action target.");
            return;
        }

        setActionSubmitting(true);
        setActionError("");

        try {
            if (confirmModal.action === "cancel-booking") {
                await bookingsAPI.cancel(confirmModal.targetId);
            }

            if (confirmModal.action === "delete-review") {
                await reviewsAPI.delete(confirmModal.targetId);
            }

            setConfirmModal((prev) => ({ ...prev, open: false }));
            fetchData();
        } catch (error) {
            setActionError(error.response?.data?.message || "Action failed. Please try again.");
        } finally {
            setActionSubmitting(false);
        }
    };

    const openReviewModal = (bookingId) => {
        setReviewError("");
        setReviewForm({
            bookingId,
            rating: 5,
            comment: "",
        });
        setReviewModalOpen(true);
    };

    const closeReviewModal = () => {
        if (reviewSubmitting) {
            return;
        }
        setReviewModalOpen(false);
        setReviewError("");
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setReviewError("");

        if (!reviewForm.bookingId) {
            setReviewError("Invalid booking selected for review.");
            return;
        }

        if (!reviewForm.comment.trim()) {
            setReviewError("Please write a short review comment.");
            return;
        }

        setReviewSubmitting(true);
        try {
            await reviewsAPI.create({
                bookingId: reviewForm.bookingId,
                rating: reviewForm.rating,
                comment: reviewForm.comment.trim(),
            });

            setReviewModalOpen(false);
            setReviewForm({ bookingId: "", rating: 5, comment: "" });
            fetchData();
        } catch (error) {
            setReviewError(error.response?.data?.message || "Failed to submit review.");
        } finally {
            setReviewSubmitting(false);
        }
    };

    const openDeleteReviewModal = (reviewId) => {
        setActionError("");
        setConfirmModal({
            open: true,
            action: "delete-review",
            targetId: reviewId,
            title: "Delete review",
            message: "This review will be removed permanently. Continue?",
            confirmLabel: "Delete",
            cancelLabel: "Keep review",
        });
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
            <Navbar />

            {reviewModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-[#0B1F3A]">Rate Your Stay</h2>
                            <button
                                type="button"
                                onClick={closeReviewModal}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                x
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">Rating</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setReviewForm((prev) => ({ ...prev, rating: value }))}
                                            className={`py-2 rounded-lg border font-bold ${reviewForm.rating === value
                                                ? "bg-[#FF7A00] border-[#FF7A00] text-white"
                                                : "bg-white border-gray-300 text-[#0B1F3A] hover:border-[#FF7A00]"
                                                }`}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">Review comment</label>
                                <textarea
                                    rows="4"
                                    value={reviewForm.comment}
                                    onChange={(e) =>
                                        setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                                    }
                                    placeholder="Share your experience with this stay"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]"
                                />
                            </div>

                            {reviewError && (
                                <p className="text-red-600 text-sm bg-red-50 py-2.5 px-3 rounded-xl border border-red-200">
                                    {reviewError}
                                </p>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeReviewModal}
                                    className="flex-1 py-3 rounded-xl border border-gray-300 text-[#0B1F3A] font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={reviewSubmitting}
                                    className="flex-1 bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white py-3 rounded-xl font-bold disabled:opacity-50"
                                >
                                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmModal.open && (
                <div className="fixed inset-0 z-50 bg-[#0B1F3A]/50 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 animate-fadeIn">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-[#0B1F3A]">{confirmModal.title}</h2>
                            <p className="text-[#475569] mt-2">{confirmModal.message}</p>
                        </div>

                        {actionError && (
                            <p className="text-red-600 text-sm bg-red-50 py-2.5 px-3 rounded-xl border border-red-200 mb-4">
                                {actionError}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={closeConfirmModal}
                                disabled={actionSubmitting}
                                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-[#0B1F3A] font-semibold disabled:opacity-60"
                            >
                                {confirmModal.cancelLabel}
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmAction}
                                disabled={actionSubmitting}
                                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 rounded-xl font-semibold disabled:opacity-60"
                            >
                                {actionSubmitting ? "Please wait..." : confirmModal.confirmLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-[#0B1F3A] mb-8">My Bookings</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-gray-200 rounded">
                        <p className="text-gray-600 text-lg mb-4">No bookings</p>
                        <button
                            onClick={() => navigate("/home")}
                            className="bg-gray-900 text-white px-6 py-2 rounded"
                        >
                            Browse Hotels
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => {
                            const nights = calculateNights(booking.checkIn, booking.checkOut);
                            const totalPrice = calculateTotalPrice(booking);

                            return (
                                <div
                                    key={booking._id}
                                    className="bg-white border border-gray-200 rounded p-6 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-bold">{booking.hotelId?.hotelName}</p>
                                        <p className="text-sm text-gray-600">
                                            Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">Stay: {nights} night{nights === 1 ? "" : "s"}</p>

                                        {reviewByBookingId[booking._id] && (
                                            <div className="mt-3 p-3 bg-[#F8FAFC] border border-gray-200 rounded-lg max-w-xl">
                                                <p className="text-sm font-semibold text-[#0B1F3A]">
                                                    Your review: {reviewByBookingId[booking._id].rating}/5
                                                </p>
                                                <p className="text-sm text-[#334155] mt-1">
                                                    {reviewByBookingId[booking._id].comment}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-lg text-[#0B1F3A]">Rs {totalPrice}</p>
                                        <p className="text-xs text-gray-500">
                                            Rs {booking.roomId?.price || 0}/night
                                        </p>
                                        <p className="text-sm capitalize mt-1">{booking.status}</p>
                                        {booking.status === "pending" && (
                                            <button
                                                onClick={() => openCancelModal(booking._id)}
                                                className="mt-2 bg-red-600 text-white px-4 py-1 rounded text-sm"
                                            >
                                                Cancel
                                            </button>
                                        )}

                                        {canReviewBooking(booking) && !reviewByBookingId[booking._id] && (
                                            <button
                                                onClick={() => openReviewModal(booking._id)}
                                                className="mt-2 block w-full bg-[#0B1F3A] text-white px-4 py-1.5 rounded text-sm"
                                            >
                                                Add Review
                                            </button>
                                        )}

                                        {reviewByBookingId[booking._id] && (
                                            <button
                                                onClick={() => openDeleteReviewModal(reviewByBookingId[booking._id]._id)}
                                                className="mt-2 block w-full border border-red-300 text-red-700 px-4 py-1.5 rounded text-sm"
                                            >
                                                Delete Review
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};