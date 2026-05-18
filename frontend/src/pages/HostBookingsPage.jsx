import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { bookingsAPI } from "../api/api";

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

export const HostBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingsAPI.getHostBookings();
            setBookings(response.data);
        } catch (error) {
            console.error("Error fetching host bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setActionError("");
        try {
            await bookingsAPI.approve(id);
            fetchBookings();
        } catch (error) {
            setActionError(error.response?.data?.message || "Approval failed.");
        }
    };

    const handleReject = async (id) => {
        setActionError("");
        try {
            await bookingsAPI.reject(id);
            fetchBookings();
        } catch (error) {
            setActionError(error.response?.data?.message || "Rejection failed.");
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-[#0B1F3A] mb-8">Booking Requests</h1>

                {actionError && (
                    <p className="text-red-600 text-sm bg-red-50 py-2.5 px-3 rounded-xl border border-red-200 mb-6">
                        {actionError}
                    </p>
                )}

                {loading ? (
                    <p>Loading...</p>
                ) : bookings.length === 0 ? (
                    <p className="text-center py-12">No booking requests</p>
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
                                            {booking.userId?.name} - Guests: {booking.guestsCount}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()} ({nights} night{nights === 1 ? "" : "s"})
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-lg text-[#0B1F3A]">Rs {totalPrice}</p>
                                        <p className="text-xs text-gray-500 mb-2">
                                            Rs {booking.roomId?.price || 0}/night
                                        </p>
                                        <span
                                            className={`text-sm font-bold px-3 py-1 rounded ${booking.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : booking.status === "approved"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>

                                        {booking.status === "pending" && (
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => handleApprove(booking._id)}
                                                    className="bg-green-600 text-white px-4 py-1 rounded text-sm"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(booking._id)}
                                                    className="bg-red-600 text-white px-4 py-1 rounded text-sm"
                                                >
                                                    Reject
                                                </button>
                                            </div>
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