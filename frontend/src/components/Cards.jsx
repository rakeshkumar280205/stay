import { ImageGallery } from "./ImageGallery";

/**
 * Hotel Card Component
 */
export const HotelCard = ({ hotel, onClick }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 group">
            {hotel.images && hotel.images.length > 0 && (
                <div onClick={(e) => e.stopPropagation()}>
                    <ImageGallery
                        images={hotel.images}
                        altText={hotel.hotelName}
                        variant="card"
                    />
                </div>
            )}
            <div className="p-6" onClick={onClick}>
                <h3 className="text-2xl font-bold text-[#0B1F3A] mb-3 group-hover:text-[#FF7A00] transition-colors duration-300">{hotel.hotelName}</h3>
                <p className="text-[#64748B] text-sm mb-4 flex items-center gap-2">
                    <span className="text-lg">📍</span> {hotel.location}
                </p>
                <p className="text-[#102A4C] text-sm line-clamp-2 leading-relaxed">{hotel.description}</p>
            </div>
        </div>
    );
};

/**
 * Room Card Component
 */
export const RoomCard = ({ room, onSelect }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 hover:shadow-2xl transition-all duration-300 group">
            {room.images && room.images.length > 0 && (
                <div className="mb-5">
                    <ImageGallery
                        images={room.images}
                        altText={room.roomType}
                        variant="card"
                    />
                </div>
            )}
            <h4 className="text-2xl font-bold text-[#0B1F3A] capitalize mb-3">{room.roomType}</h4>
            <div className="bg-gradient-to-r from-[#FFF5EB] to-[#FFEDD5] p-4 rounded-xl mb-4 border-l-4 border-[#FF7A00]">
                <p className="text-[#FF7A00] font-bold text-3xl">₹{room.price}<span className="text-sm text-[#64748B] font-normal">/night</span></p>
            </div>
            <p className="text-[#64748B] text-sm mb-5">
                Available: <span className="font-bold text-[#0B1F3A] text-lg">{room.availableRoomsCount}</span> rooms
            </p>
            {room.amenities && room.amenities.length > 0 && (
                <div className="mb-5">
                    <p className="text-sm font-bold text-[#0B1F3A] mb-3">Amenities:</p>
                    <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity, idx) => (
                            <span key={idx} className="bg-gradient-to-r from-[#FFF5EB] to-[#FFEDD5] text-[#FF7A00] px-4 py-2 rounded-full text-xs font-semibold border border-[#FFA94D]/30">
                                {amenity}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            <button
                onClick={onSelect}
                className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF8C1A] text-white py-3.5 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
                Select Room
            </button>
        </div>
    );
};

/**
 * Booking Card Component
 */
export const BookingCard = ({ booking, onApprove, onReject, userView = false }) => {
    const statusColors = {
        pending: "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-2 border-yellow-300",
        approved: "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-2 border-green-300",
        rejected: "bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-2 border-red-300",
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-5">
                <div>
                    <h4 className="text-xl font-bold text-[#0B1F3A] mb-1">{booking.hotelId?.hotelName}</h4>
                    <p className="text-[#64748B] capitalize text-sm">{booking.roomId?.roomType} Room</p>
                </div>
                <span className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-md ${statusColors[booking.status]}`}>
                    {booking.status.toUpperCase()}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-5 bg-gray-50 p-4 rounded-xl">
                <p className="text-[#102A4C]">
                    <span className="font-bold block text-[#64748B] text-xs mb-1">Check-in:</span>
                    <span className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</span>
                </p>
                <p className="text-[#102A4C]">
                    <span className="font-bold block text-[#64748B] text-xs mb-1">Check-out:</span>
                    <span className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</span>
                </p>
                <p className="text-[#102A4C]">
                    <span className="font-bold block text-[#64748B] text-xs mb-1">Guests:</span>
                    <span className="font-semibold">{booking.guestsCount}</span>
                </p>
                <p className="text-[#102A4C]">
                    <span className="font-bold block text-[#64748B] text-xs mb-1">Total Price:</span>
                    <span className="text-[#FF7A00] font-bold text-lg">₹{booking.roomId?.price}</span>
                </p>
            </div>

            {!userView && booking.status === "pending" && (
                <div className="flex gap-3">
                    <button
                        onClick={onApprove}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200"
                    >
                        Approve
                    </button>
                    <button
                        onClick={onReject}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-200"
                    >
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
};
