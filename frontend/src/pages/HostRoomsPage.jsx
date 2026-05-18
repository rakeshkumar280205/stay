import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hotelsAPI, roomsAPI } from "../api/api";
import { Navbar } from "../components/Navbar";

export const HostRoomsPage = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        fetchData();
    }, [hotelId]);

    const fetchData = async () => {
        try {
            const [h, r] = await Promise.all([hotelsAPI.getById(hotelId), roomsAPI.getByHotel(hotelId)]);
            setHotel(h.data);
            setRooms(r.data);
        } catch (error) {
            console.error("Error loading rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (room) => {
        setDeleteError("");
        setRoomToDelete(room);
    };

    const confirmDelete = async () => {
        if (!roomToDelete) {
            return;
        }

        setDeleteLoading(true);
        setDeleteError("");
        try {
            await roomsAPI.delete(roomToDelete._id);
            setRooms(rooms.filter((room) => room._id !== roomToDelete._id));
            setRoomToDelete(null);
        } catch (error) {
            setDeleteError(error.response?.data?.message || "Delete failed.");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
            <Navbar />

            {roomToDelete && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-3">Delete Room</h2>
                        <p className="text-[#334155] mb-2">
                            Are you sure you want to delete <span className="font-semibold capitalize">{roomToDelete.roomType}</span>?
                        </p>
                        <p className="text-sm text-[#64748B] mb-6">
                            This action cannot be undone.
                        </p>

                        {deleteError && (
                            <p className="text-red-600 text-sm bg-red-50 py-2.5 px-3 rounded-xl border border-red-200 mb-4">
                                {deleteError}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setRoomToDelete(null)}
                                disabled={deleteLoading}
                                className="flex-1 py-3 rounded-xl border border-gray-300 text-[#0B1F3A] font-semibold disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={deleteLoading}
                                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
                            >
                                {deleteLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0B1F3A]">Rooms - {hotel?.hotelName}</h1>
                        <p className="text-gray-600">{hotel?.location}</p>
                    </div>
                    <button
                        onClick={() => navigate(`/host/add-rooms/${hotelId}`)}
                        className="bg-gray-900 text-white px-6 py-2 rounded"
                    >
                        Add Room
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {rooms.length === 0 ? (
                        <p>No rooms added</p>
                    ) : (
                        rooms.map((room) => (
                            <div key={room._id} className="bg-white border border-gray-200 rounded p-6">
                                <h3 className="font-bold capitalize text-lg mb-4">{room.roomType}</h3>
                                <p className="mb-2">Price: ₹{room.price}/night</p>
                                <p className="mb-4">Available: {room.availableRoomsCount}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/host/edit-room/${room._id}`)}
                                        className="flex-1 bg-blue-600 text-white py-2 rounded text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(room)}
                                        className="flex-1 bg-red-600 text-white py-2 rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};