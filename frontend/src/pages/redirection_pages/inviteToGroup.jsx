import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

const InviteToGroup = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [groupInfo, setGroupInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/groups/info/${id}`, {
          withCredentials: true,
        });
        setGroupInfo(response.data.data);
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 401) {
          // User not logged in, redirect to login
          navigate("/login", { state: { from: `/group/invite/${id}` } });
        } else {
          setError("Group not found or you don't have access to it");
          setLoading(false);
        }
      }
    };
    fetchGroupInfo();
  }, [id, navigate]);

  const handleJoinGroup = async () => {
    setJoining(true);
    try {
      const response = await axios.post(
        `${API_URL}/groups/join`,
        {
          groupId: id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("Successfully joined the group!");
        navigate(`/dashboard/group/${id}`);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to join group. Please try again.");
      }
    } finally {
      setJoining(false);
    }
  };

  const handleDecline = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-5xl text-[#2D2D2D] font-extrabold text-center mt-3 text-shadow-[#8B8B8B]-lg/20 drop-shadow-lg">
          Splitzy
        </div>
        <div className="text-2xl text-[#6C4AB6] font-bold mt-8">
          Loading group information...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-5xl text-[#2D2D2D] font-extrabold text-center mt-3 text-shadow-[#8B8B8B]-lg/20 drop-shadow-lg">
          Splitzy
        </div>
        <div className="flex flex-col items-center justify-center max-w-sm p-4 rounded-md border-2 border-[#2D2D2D] border-opacity-30 bg-[#FFF7ED]/10 rounded-[16px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[3.6px] border border-white/30">
          <div className="text-xl text-red-600 font-bold mb-4 text-center">
            {error}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-[#6C4AB6] text-white rounded-lg hover:bg-[#8D72E1] transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl text-[#2D2D2D] font-extrabold text-center mt-3 text-shadow-[#8B8B8B]-lg/20 drop-shadow-lg">
        Splitzy
      </h1>

      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center max-w-sm p-4 rounded-md border-2 border-[#2D2D2D] border-opacity-30 bg-[#FFF7ED]/10 rounded-[16px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[3.6px] border border-black/10">
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <h1 className="text-3xl text-[#2D2D2D] font-bold text-center">
              Group Invitation
            </h1>

            {/* Group Info */}
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="w-20 h-20 rounded-xl border-2 border-[#6C4AB6] bg-white/20 flex items-center justify-center">
                <img
                  src={groupInfo.groupAvatar}
                  alt={groupInfo.name[0]}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-[#2D2D2D] text-center">
                {groupInfo.name}
              </h2>
              <p className="text-sm text-gray-600 text-center">
                You've been invited to join this group
              </p>

              {/* Members count */}
              <div className="text-sm text-[#6C4AB6] font-medium">
                {groupInfo.users.length} member
                {groupInfo.users.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full mt-4">
              <button
                className="w-full p-3 bg-[#6C4AB6] text-white rounded-lg font-semibold hover:bg-[#8D72E1] transition disabled:opacity-50"
                onClick={handleJoinGroup}
                disabled={joining}
              >
                {joining ? "Joining..." : "Join Group"}
              </button>
              <button
                className="w-full p-3 bg-white/80 text-[#6C4AB6] rounded-lg font-semibold hover:bg-gray-200 transition border border-gray-300"
                onClick={handleDecline}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteToGroup;
