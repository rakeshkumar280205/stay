import { useEffect, useState } from "react";
import { adminAPI } from "../api/api";
import { Navbar } from "../components/Navbar";

export const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteState, setDeleteState] = useState({
        open: false,
        userId: "",
        userName: "",
    });
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getUsers();
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setActionError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const openDeleteModal = (user) => {
        setActionError("");
        setDeleteState({
            open: true,
            userId: user._id,
            userName: user.name || "this user",
        });
    };

    const closeDeleteModal = () => {
        if (actionLoading) {
            return;
        }
        setDeleteState({
            open: false,
            userId: "",
            userName: "",
        });
    };

    const handleDelete = async () => {
        if (!deleteState.userId) {
            setActionError("Invalid user selected.");
            return;
        }

        setActionLoading(true);
        setActionError("");
        try {
            await adminAPI.deleteUser(deleteState.userId);
            closeDeleteModal();
            await fetchUsers();
        } catch (error) {
            setActionError(error.response?.data?.message || "Delete failed.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
            <Navbar />

            {deleteState.open && (
                <div className="fixed inset-0 z-50 bg-[#0B1F3A]/50 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-2">Delete user</h2>
                        <p className="text-[#475569] mb-4">
                            Are you sure you want to delete <span className="font-semibold">{deleteState.userName}</span>?
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
                                Keep user
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
                <h1 className="text-3xl font-bold text-[#0B1F3A] mb-8">Manage Users</h1>

                {!deleteState.open && actionError && (
                    <p className="text-red-600 text-sm bg-red-50 py-2.5 px-3 rounded-xl border border-red-200 mb-4">
                        {actionError}
                    </p>
                )}

                {loading ? (
                    <p>Loading...</p>
                ) : users.length === 0 ? (
                    <p>No users</p>
                ) : (
                    <table className="w-full border-collapse bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-900 text-white">
                                <th className="border p-4 text-left">Name</th>
                                <th className="border p-4 text-left">Email</th>
                                <th className="border p-4 text-left">Phone</th>
                                <th className="border p-4 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border">
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{user.phone}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => openDeleteModal(user)}
                                            className="bg-red-600 text-white px-4 py-1 rounded text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
