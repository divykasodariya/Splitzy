import React from "react";
import { API_URL } from "../config";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const GroupDashboard = () => {
  const { id } = useParams();
  const [groupInfo, setGroupInfo] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchGroup = async () => {
      const response = await axios.get(`${API_URL}/groups/info/${id}`, {
        withCredentials: true,
      });
      setGroupInfo(response.data);
      console.log(response);
    };
    fetchGroup();
  }, [id]);

  if (!groupInfo || !groupInfo.data) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const group = groupInfo.data;

  const handleInviteFriend = () => {
    // console.log("invite friend");
    navigator.clipboard.writeText(`${window.location.origin}/group/invite/${id}`);
    alert("Invite link copied to clipboard");
 
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#6C4AB6]/30 to-[#8D72E1]/40">
      {/* Header */}
      <div className="flex items-center gap-4 px-3 py-3 h-20 rounded-b-3xl shadow-md  bg-[#E9E9FE] shadow-lg ring-1 ring-black/5">
        <div className="flex items-center justify-center text-2xl text-center">
          <img
            src={group.groupAvatar}
            alt={group.name[0]}
            className="w-14 h-14 rounded-xl p-1 object-cover border-2 border-[#6C4AB6] bg-white/20 text-gray-700  "
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#2D2D2D]">{group.name}</h1>
        </div>
        {/* <button className="text-[#6C4AB6] text-2xl">⚙️</button> */}
      </div>

      {/* Members */}
      <div className="flex gap-4 px-6 py-2 mt-2">
        {group.users.map((user) => (
          <div key={user._id} className="flex flex-col items-center">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-12 h-12 rounded-full border-2 border-[#6C4AB6]"
            />
            <span className="text-xs text-[#6C4AB6] mt-1">{user.username}</span>
          </div>
        ))}
        {/* add friend button card */}
        <div key="invite_frnd" onClick={handleInviteFriend} className="flex flex-col items-center ">
          
          <div className="w-12 h-12 rounded-full border-2 border-[#6C4AB6] flex items-center justify-center bg-[#d7a3ff]">
            <svg
              class="w-6 h-6 text-gray-800  text-[#7730af]/40 bg-[#d7a3ff]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
          <span className="text-xs text-[#6C4AB6] mt-1">invite friend</span>
        </div>
      </div>

      {/* Transactions Summary */}
      <div className="text-[#6C4AB6] font-extrabold text-lg mb-1 px-5 mt-3">
        Transactions
      </div>
      {group.transactions.length === 0 && (
        <div className="text-[#2D2D2D] text-sm px-5 ">No transactions yet.</div>
      )}
      {group.transactions.length > 0 && (
        <div className="flex flex-col-reverse gap-4 px-6 py-4 bg-[#E9E9FE]/80 rounded-2xl shadow-lg mx-4 mt-2  bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
          {group.transactions.map((txn) => (
            <div onClick={()=>navigate(`/dashboard/transaction/${txn._id}`)}>
            <div
              key={txn._id}
              className="mb-4 pb-4 border-b border-[#D9D9FE] last:border-b-0 last:pb-0 last:mb-0"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  {/* Transaction Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-[#2D2D2D]">
                        {txn.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(txn.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        &middot; Paid by{" "}
                        <span className="font-medium">
                          {txn.payer.username}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`font-bold text-lg ${
                        txn.amount >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {txn.amount >= 0 ? "+" : ""}
                      {txn.currency} {Math.abs(txn.amount).toLocaleString()}
                    </div>
                  </div>
                  {/* Split Details */}
                  <div className="mt-3 ml-1 space-y-2">
                    {txn.splitDetails.map((split) => (
                      <div
                        key={split._id}
                        className="flex items-center justify-between bg-white/50 px-3 py-2 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#2D2D2D]">
                            {split.user.username}
                          </span>
                          <span className="text-gray-500 text-sm">owes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#6C4AB6]">
                            {txn.currency} {split.share.toLocaleString()}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              split.isPaid
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {split.isPaid ? "Paid" : "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>
      )}
      {/* Add Expense Button */}
      <button
        onClick={() => navigate(`/add-expense/${id}`)}
        className="fixed bottom-24 right-6 bg-[#6C4AB6] hover:bg-[#8D6BD9] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-lg font-semibold z-10"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 5v14m7-7H5" />
        </svg>
        Add expense
      </button>

      {/* Bottom NavBar */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#E9E9FE]/90 backdrop-blur-md shadow-t flex justify-around items-center h-16 z-40 rounded-t-2xl border-t border-[#6C4AB6]/20">
        <button
          className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition"
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          <span className="text-2xl">👥</span>
          <span className="text-xs">Groups</span>
        </button>
        <button  className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition">
          <span className="text-2xl">🤝</span>
          <span className="text-xs">Friends</span>
        </button>
        <button onClick={()=>navigate("/dashboard/activity")} className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition relative">
          <span className="text-2xl">📊</span>
          <span className="text-xs">Activity</span>
          <span className="absolute top-0 right-2 w-2 h-2 bg-[#F9F871] rounded-full animate-pulse"></span>
        </button>
        <button onClick={()=>navigate("/dashboard/profile")} className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition">
          <span className="text-2xl">👤</span>
          <span className="text-xs">Account</span>
        </button>
      </nav>
    </div>
  );
};
export default GroupDashboard;
