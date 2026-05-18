import { useEffect, useState } from "react";
import { adminAPI } from "../api/api";
import { Navbar } from "../components/Navbar";

export const AdminHostsPage = () => {
    const [hosts, setHosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteState, setDeleteState] = useState({
        open: false,
        hostId: "",
        hostName: "",
    });
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        fetchHosts();
    }, []);

    const fetchHosts = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getHosts();
            setHosts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setActionError("Failed to load hosts.");
        } finally {
            setLoading(false);
        }
    };

    const openDeleteModal = (host) => {
        setActionError("");
        setDeleteState({
            open: true,
            hostId: host._id,
            hostName: host.name || "this host",
        });
    };

    const closeDeleteModal = () => {
        if (actionLoading) {
            return;
        }
        setDeleteState({
            open: false,
            hostId: "",
            hostName: "",
        });
    };

    const handleDelete = async () => {
        if (!deleteState.hostId) {
            setActionError("Invalid host selected.");
            return;
        }

        setActionLoading(true);
        setActionError("");
        try {
            await adminAPI.deleteHost(deleteState.hostId);
            closeDeleteModal();
            await fetchHosts();
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
                        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-2">Delete host</h2>
                        <p className="text-[#475569] mb-4">
                            Are you sure you want to delete <span className="font-semibold">{deleteState.hostName}</span>?
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
                                Keep host
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
                <h1 className="text-3xl font-bold text-[#0B1F3A] mb-8">Manage Hosts</h1>

                {!deleteState.open && actionError && (
                    <p className="text-red-600 text-sm bg-red-50 py-2.5 px-3 rounded-xl border border-red-200 mb-4">
                        {actionError}
                    </p>
                )}

                {loading ? (
                    <p>Loading...</p>
                ) : hosts.length === 0 ? (
                    <p>No hosts</p>
                ) : (
                    <table className="w-full border-collapse bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-900 text-white">
                                <th className="border p-4 text-left">Name</th>
                                <th className="border p-4 text-left">Email</th>
                                <th className="border p-4 text-left">Phone</th>
                                <th className="border p-4 text-left">Role</th>
                                <th className="border p-4 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hosts.map((host) => (
                                <tr key={host._id} className="border">
                                    <td className="p-4">{host.name}</td>
                                    <td className="p-4">{host.email}</td>
                                    <td className="p-4">{host.phone}</td>
                                    <td className="p-4 capitalize">{host.role}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => openDeleteModal(host)}
                                            disabled={host.role === "admin"}
                                            className="bg-red-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50"
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
