import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { bookingsAPI, roomsAPI } from "../api/api";
import { ImageGallery } from "../components/ImageGallery";
import { Navbar } from "../components/Navbar";

const DATE_DISPLAY_OPTIONS = {
    day: "2-digit",
    month: "short",
    year: "numeric",
};

export const BookingPage = () => {
    const [searchParams] = useSearchParams();
    const { roomId: routeRoomId } = useParams();
    const navigate = useNavigate();

    const roomId = searchParams.get("roomId") || routeRoomId;
    const today = new Date().toISOString().split("T")[0];

    const [room, setRoom] = useState(null);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const redirectTimeoutRef = useRef(null);

    useEffect(() => {
        fetchRoom();
    }, [roomId]);

    useEffect(() => {
        return () => {
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, []);

    const fetchRoom = async () => {
        setPageLoading(true);
        setError("");

        try {
            const response = await roomsAPI.getById(roomId);
            setRoom(response.data);
        } catch (fetchError) {
            setError("Room not found");
        } finally {
            setPageLoading(false);
        }
    };

    const nights = useMemo(() => {
        if (!checkIn || !checkOut) {
            return 0;
        }

        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        const diffMs = endDate - startDate;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : 0;
    }, [checkIn, checkOut]);

    const totalAmount = useMemo(() => {
        return nights > 0 ? nights * Number(room?.price || 0) : 0;
    }, [nights, room]);

    const isSoldOut = Number(room?.availableRoomsCount || 0) <= 0;

    const handleBooking = async (e) => {
        e.preventDefault();

        setError("");
        setSuccessMessage("");

        if (!roomId) {
            setError("Invalid room selection. Please choose a room again.");
            return;
        }

        if (!checkIn || !checkOut) {
            setError("Please select check-in and check-out dates.");
            return;
        }

        if (new Date(checkIn) >= new Date(checkOut)) {
            setError("Check-out date must be after check-in date.");
            return;
        }

        if (isSoldOut) {
            setError("This room is currently sold out.");
            return;
        }

        setLoading(true);

        try {
            const hotelIdValue =
                typeof room?.hotelId === "object"
                    ? room.hotelId?._id
                    : room?.hotelId;

            await bookingsAPI.create({
                hotelId: hotelIdValue,
                roomId,
                checkIn,
                checkOut,
                guestsCount: guests,
            });

            setSuccessMessage("Booking submitted successfully! Redirecting to My Bookings...");
            redirectTimeoutRef.current = setTimeout(() => {
                navigate("/my-bookings");
            }, 1400);
        } catch (bookingError) {
            setError(bookingError.response?.data?.message || "Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[#0B1F3A] text-lg font-semibold">
                Loading room details...
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[#0B1F3A] text-lg font-semibold">
                {error || "Room not found"}
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
            <Navbar />

            {successMessage && (
                <div className="fixed top-24 right-6 z-[60] max-w-sm transition-opacity duration-300">
                    <div className="rounded-2xl border border-emerald-200 bg-white/95 backdrop-blur px-5 py-4 shadow-2xl">
                        <p className="text-sm font-semibold text-emerald-700">Success</p>
                        <p className="mt-1 text-sm text-[#0B1F3A]">{successMessage}</p>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        {room.images?.length > 0 && (
                            <ImageGallery
                                images={room.images}
                                altText={`${room.roomType} room`}
                                variant="hotel"
                                mainHeightClassName="h-64 md:h-80"
                            />
                        )}

                        <div className="p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                <h1 className="text-3xl font-extrabold text-[#0B1F3A] capitalize">
                                    {room.roomType} Room
                                </h1>
                                <span className="text-[#FF7A00] font-extrabold text-2xl">
                                    Rs {room.price}
                                    <span className="text-sm font-medium text-[#64748B]">/night</span>
                                </span>
                            </div>

                            <p className="text-[#64748B] mb-2">
                                Hotel: <span className="font-semibold text-[#0B1F3A]">{room.hotelId?.hotelName || "Selected hotel"}</span>
                            </p>
                            <p className="text-[#64748B] mb-4">
                                Location: <span className="font-semibold text-[#0B1F3A]">{room.hotelId?.location || "Not specified"}</span>
                            </p>

                            <div className="flex flex-wrap gap-3 mb-5">
                                <span className="px-3 py-1.5 rounded-full bg-[#EEF2FF] text-[#1E293B] text-sm font-semibold">
                                    Available: {room.availableRoomsCount || 0} room(s)
                                </span>
                                <span className="px-3 py-1.5 rounded-full bg-[#FFF5EB] text-[#B45309] text-sm font-semibold">
                                    Instant pricing
                                </span>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-[#0B1F3A] mb-2">Room amenities</p>
                                {room.amenities?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {room.amenities.map((amenity, index) => (
                                            <span
                                                key={`booking-amenity-${index}`}
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
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-fit">
                        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-5">Book This Room</h2>

                        <form onSubmit={handleBooking} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">Check-in</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    min={today}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">Check-out</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    min={checkIn || today}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">Guests</label>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                                        className="w-11 h-11 rounded-xl border-2 border-gray-200 text-[#0B1F3A] font-bold hover:border-[#FF7A00]"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={guests}
                                        onChange={(e) => {
                                            const parsed = Number(e.target.value);
                                            if (Number.isNaN(parsed)) {
                                                setGuests(1);
                                                return;
                                            }
                                            setGuests(Math.min(10, Math.max(1, parsed)));
                                        }}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setGuests((prev) => Math.min(10, prev + 1))}
                                        className="w-11 h-11 rounded-xl border-2 border-gray-200 text-[#0B1F3A] font-bold hover:border-[#FF7A00]"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-2">
                                <p className="text-sm text-[#334155] flex items-center justify-between">
                                    <span>Room price</span>
                                    <span className="font-semibold">Rs {room.price}/night</span>
                                </p>
                                <p className="text-sm text-[#334155] flex items-center justify-between">
                                    <span>Stay duration</span>
                                    <span className="font-semibold">
                                        {nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "Select dates"}
                                    </span>
                                </p>
                                <div className="h-px bg-[#E2E8F0]" />
                                <p className="text-[#0B1F3A] font-bold flex items-center justify-between text-base">
                                    <span>Total</span>
                                    <span>Rs {totalAmount || 0}</span>
                                </p>
                            </div>

                            {checkIn && checkOut && nights > 0 && (
                                <p className="text-xs text-[#64748B]">
                                    Selected dates: {new Date(checkIn).toLocaleDateString("en-IN", DATE_DISPLAY_OPTIONS)} to {new Date(checkOut).toLocaleDateString("en-IN", DATE_DISPLAY_OPTIONS)}
                                </p>
                            )}

                            <div className="rounded-xl border border-[#FED7AA] bg-[#FFF7ED] p-3 text-xs text-[#9A3412]">
                                Bookings are created with pending status and must be approved by the host.
                            </div>

                            {error && (
                                <p className="text-red-600 text-sm bg-red-50 py-2.5 px-3 rounded-xl border border-red-200">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || isSoldOut}
                                className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white py-3.5 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Submitting..." : isSoldOut ? "Room Sold Out" : "Confirm Booking"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};