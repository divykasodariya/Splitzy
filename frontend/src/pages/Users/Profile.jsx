import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";

const Profile = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({
        username: "Loading...",
        email: "Loading...",
        avatar: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/profile`, {
                    withCredentials: true
                });
                console.log(response.data.user);
                setCurrentUser(response.data.user);
                setLoading(false);
            } catch (error) {
                setError(error.response);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.delete(`${API_URL}/users/logout`, {
                withCredentials: true
            });
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            // Still navigate to login even if logout fails
            navigate("/login");
        }
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data."
        );
        if (confirmed) {
            // TODO: Implement delete account functionality
            alert("Delete account functionality coming soon!");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#6C4AB6]/30 to-[#8D72E1]/40 flex items-center justify-center">
                <div className="text-2xl font-bold text-[#6C4AB6]">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#6C4AB6]/30 to-[#8D72E1]/40 flex items-center justify-center">
                <div className="text-xl text-red-600">Error: {error?.data?.message || "Something went wrong"}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#6C4AB6]/30 to-[#8D72E1]/40">
            {/* Header */}
            <nav className="text-2xl font-bold py-4 px-6 bg-[#E9E9FE]/90 shadow-lg flex items-center">
                <button 
                    onClick={() => navigate("/dashboard")}
                    className="mr-4 text-[#6C4AB6] hover:text-[#8D72E1] transition text-3xl"
                >
                    ←
                </button>
                <span className="text-[#6C4AB6]">Profile</span>
            </nav>

            {/* Profile Content */}
            <div className="px-4 py-6">
                {/* Profile Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <img 
                                src={currentUser.avatar} 
                                alt="profile" 
                                className="w-20 h-20 rounded-full border-4 border-[#6C4AB6]/20 shadow-lg" 
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white">✓</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">{currentUser.username}</h1>
                            <p className="text-gray-600">{currentUser.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    Active Member
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Account Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div onClick={()=>navigate("/dashboard/activity")} className="bg-gradient-to-r from-[#6C4AB6]/10 to-[#8D72E1]/10 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-[#6C4AB6]">📊</div>
                            <div className="text-sm text-gray-600 mt-1">Activities</div>
                        </div>
                        <div onClick={()=>navigate("/dashboard")} className="bg-gradient-to-r from-[#6C4AB6]/10 to-[#8D72E1]/10 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-[#6C4AB6]">👥</div>
                            <div className="text-sm text-gray-600 mt-1">Groups</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    {/* Settings Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">⚙️</span>
                                    <span className="text-gray-700">Edit Profile</span>
                                </div>
                                <span className="text-gray-400">→</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🔒</span>
                                    <span className="text-gray-700">Privacy Settings</span>
                                </div>
                                <span className="text-gray-400">→</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🔔</span>
                                    <span className="text-gray-700">Notifications</span>
                                </div>
                                <span className="text-gray-400">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
                        <div className="space-y-3">
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🚪</span>
                                    <span className="text-orange-700">Logout</span>
                                </div>
                                <span className="text-orange-400">→</span>
                            </button>
                            <button 
                                onClick={handleDeleteAccount}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-red-50 hover:bg-red-100 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🗑️</span>
                                    <span className="text-red-700">Delete Account</span>
                                </div>
                                <span className="text-red-400">→</span>
                            </button>
                        </div>
                    </div>

                    {/* App Info */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">App Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">📱</span>
                                    <span className="text-gray-700">Version</span>
                                </div>
                                <span className="text-gray-500">1.0.0</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">📧</span>
                                    <span className="text-gray-700">Support</span>
                                </div>
                                <span className="text-gray-500">support@splitzy.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 w-full bg-[#E9E9FE]/90 backdrop-blur-md shadow-t flex justify-around items-center h-16 z-40 rounded-t-2xl border-t border-[#6C4AB6]/20">
                <button
                    className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition"
                    onClick={() => navigate("/dashboard")}
                >
                    <span className="text-2xl">👥</span>
                    <span className="text-xs">Groups</span>
                </button>
                <button className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition">
                    <span className="text-2xl">🤝</span>
                    <span className="text-xs">Friends</span>
                </button>
                <button 
                    onClick={() => navigate("/dashboard/activity")} 
                    className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition"
                >
                    <span className="text-2xl">📊</span>
                    <span className="text-xs">Activity</span>
                </button>
                <button 
                    onClick={() => navigate("/dashboard/profile")} 
                    className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition relative"
                >
                    <span className="text-2xl">👤</span>
                    <span className="text-xs">Account</span>
                    <span className="absolute top-0 right-2 w-2 h-2 bg-[#F9F871] rounded-full animate-pulse"></span>
                </button>
            </nav>
        </div>
    );
};

export default Profile; 