import { useState, useEffect } from "react";
import { API_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const [userSummary, setUserSummary] = useState({
    totalOwed: "₹0.00",
    totalOwe: "₹0.00",
    netBalance: "You're all settled up!",
  });

  useEffect(() => {
  getAllGroups();
    getUserSummary();
  }, []);

  // const handleSearch = () => {
  //   alert("Search clicked!");

  // };
  const handleCreateGroup = () => {
    // alert("Create group clicked!");
    navigate("/dashboard/create-group");
  };

  const getAllGroups = async () => {
    const response = await axios.get(`${API_URL}/groups/getall`, {
      withCredentials: true,
    });
    console.log(response);
    setGroups(response.data);
  };
  const getUserSummary = async () => {
    const response = await axios.get(`${API_URL}/users/balance`, {
      withCredentials: true,
    });
    console.log(response);
    setUserSummary(response.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6C4AB6]/30 to-[#8D72E1]/40 flex flex-col relative">
      {/* Top nav */}
      <nav className="flex justify-between bg-[#E9E9FE]/90 items-center h-16 p-4 gap-2 bg-[#6C4AB6]/10 shadow-lg ring-1 ring-black/5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-[#6C4AB6] drop-shadow-lg text-shadow-white-500">
            Splitzy
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* <button onClick={handleSearch} className="hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><path fill="#6C4AB6" d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path></svg>
          </button> */}
          <button
            onClick={handleCreateGroup}
            className="hover:scale-110 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 512 341.39"
            >
              <path
                fill="#6C4AB6"
                d="M3.62 302.83c-2 0-3.62-1.62-3.62-3.62 0-1.04.14-2.05.39-3.06 5.8-46 41.82-58.27 67.37-64.9 12.79-3.31 44.6-15.93 31.92-33.3-7.1-9.74-13.53-16.58-19.97-26.87-4.65-6.86-7.1-12.99-7.1-17.89 0-5.23 2.77-11.35 8.32-12.74-.73-10.53-.98-24.38-.48-35.65 1.76-19.35 15.64-33.61 33.57-39.93 7.09-2.7 3.66-13.49 11.5-13.72 18.38-.5 48.51 15.19 60.28 27.92 6.86 7.35 11.26 17.15 12 30.14l-.74 32.46c3.43.98 5.64 3.19 6.62 6.62.98 3.92 0 9.31-3.43 16.91 0 .24-.25.24-.25.49-7.56 12.46-15.44 20.72-24.1 32.26-3.86 5.16-3.11 10.09.1 14.53-4.51 2.63-8.92 5.66-13.15 9.22-16.79 14.09-29.76 35.09-34.32 68.53-.9 3.91-1.25 8.64-.6 12.6H3.62zm415.6-73.61c-.03-3.56-.36-6.1 4.05-6.04l14.28.18c4.61-.03 5.84 1.43 5.79 5.75v19.48h19.36c3.55-.03 6.09-.36 6.03 4.05l-.17 14.29c.02 4.61-1.44 5.83-5.76 5.78h-19.46v19.47c.05 4.32-1.18 5.78-5.79 5.75l-14.28.18c-4.41.06-4.08-2.48-4.05-6.04v-19.36h-19.49c-4.31.05-5.77-1.17-5.75-5.78l-.17-14.29c-.07-4.41 2.48-4.08 6.03-4.05h19.38v-19.37zm12.05-49.31c22.29 0 42.48 9.04 57.08 23.65 14.61 14.61 23.65 34.81 23.65 57.09 0 22.3-9.04 42.48-23.65 57.09-14.6 14.61-34.8 23.65-57.08 23.65-22.3 0-42.48-9.04-57.09-23.65l-.45-.48c-14.35-14.59-23.2-34.59-23.2-56.61 0-22.26 9.04-42.45 23.66-57.06 14.6-14.64 34.79-23.68 57.08-23.68zm45.31 35.42c-11.59-11.59-27.61-18.76-45.31-18.76-17.7 0-33.74 7.17-45.33 18.76-11.6 11.57-18.76 27.6-18.76 45.32 0 17.53 7.01 33.41 18.36 44.94l.41.38c11.59 11.6 27.61 18.77 45.32 18.77 17.69 0 33.72-7.17 45.31-18.77 11.6-11.59 18.77-27.62 18.77-45.32 0-17.69-7.17-33.73-18.77-45.32zm-322.65 87.54c-2.44 0-4.42-1.98-4.42-4.43 0-1.25.17-2.5.48-3.73 7.08-56.13 40.73-68.33 71.87-76.34 14.95-3.84 44.78-18.85 41.16-38.2-7.54-6.99-15.03-16.65-16.33-31.06l-.91.02c-2.09-.03-4.11-.51-6-1.57-4.16-2.37-6.44-6.91-7.54-12.08-2.3-15.79-2.89-23.85 5.53-27.38l.07-.03c-1.04-19.48 2.25-48.14-17.76-54.2 39.5-48.81 85.05-75.37 119.24-31.94 38.1 2 55.09 55.96 31.43 86.17h-1c8.42 3.53 7.15 12.58 5.53 27.38-1.1 5.17-3.38 9.71-7.54 12.08-1.89 1.06-3.91 1.54-6 1.57l-.91-.02c-1.3 14.41-8.81 24.07-16.35 31.06-1.22 6.55 1.37 12.58 5.93 17.87-13.43 17.3-21.41 39.03-21.41 62.61 0 15.05 3.25 29.35 9.09 42.22H153.93z"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Summary card */}
      <div className="mx-auto mt-6 w-[90%] max-w-xl bg-gradient-to-r from-[#6C4AB6] to-[#8D72E1] rounded-2xl shadow-xl p-8 flex flex-col items-center text-white relative overflow-hidden">
        <span className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></span>
        <h2
          className={`text-2xl font-bold mb-4 tracking-wide text-center 
            ${
              userSummary.netBalance.includes("You are owed")
                ? "text-green-200"
                : userSummary.netBalance.includes("You owe")
                ? "text-red-200"
                : "text-white"
            }`}
        >
          {userSummary.netBalance.includes("You are owed") && (
            <span className="inline-block align-middle mr-2">🤑</span>
          )}
          {userSummary.netBalance.includes("You owe") && (
            <span className="inline-block align-middle mr-2">💸</span>
          )}
          {userSummary.netBalance.includes("settled") && (
            <span className="inline-block align-middle mr-2">✅</span>
          )}
          {userSummary.netBalance}
        </h2>
        <div className="flex gap-8 mt-2 mb-2 w-full justify-center">
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-white/80">
              Total Owed
            </span>
            <span className="text-3xl font-extrabold text-green-200 drop-shadow">
              {userSummary.totalOwed}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-white/80">
              Total Owe
            </span>
            <span className="text-3xl font-extrabold text-red-200 drop-shadow">
              {userSummary.totalOwe}
            </span>
          </div>
        </div>
      </div>

      {/* Groups list */}
      <div className="mx-auto mt-6 w-[90%] max-w-xl flex flex-col gap-4 overflow-y-scroll" style={{ height: "calc(100vh - 300px)" }} >
        <div className="text-[#6C4AB6] font-bold text-lg mb-1">groups</div>
       
        {groups.map((group) => (
          <div className="flex flex-col gap-1" onClick={() => navigate(`/dashboard/group/${group._id}`)}>
          <div
            key={group.name}
            className="flex items-center gap-4 p-4 rounded-xl shadow-lg bg-[#6C4AB6] text-white relative overflow-hidden"
          >
            <div className="text-3xl bg-white/10 rounded-lg p-2 text-gray-700 text-center ">
              <img
                src={group.groupAvatar}
                alt={group.name[0]}
                className="w-10 h-10"
              />
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg">{group.name}</div>
              {group.status === "settled" && (
                <div className="text-sm text-white/80">settled up</div>
              )}
              {group.status === "owed" && (
                <div className="text-sm">
                  you are owed <span className="font-bold">$16.66</span>
                  <div className="mt-1">
                    {group.balances.map((b, i) => (
                      <div key={i} className="text-xs">
                        {b.name} owes you{" "}
                        <span className="font-bold">
                          {b.currency}
                          {b.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {group.status === "none" && (
                <div className="text-sm text-white/80">no expenses</div>
              )}
            </div>
          </div>
         </div>
          ))}
        
      </div>

      {/* Floating Add Expense button
      <button onClick={handleAddExpense} className="fixed bottom-24 right-8 bg-[#6C4AB6] text-white px-6 py-3 rounded-full shadow-2xl text-lg font-bold flex items-center gap-2 hover:scale-105 transition-all z-50">
        <span className="text-2xl">🧾</span> Add expense
      </button> */}

      {/* Minimal bottom nav */}
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
        <button className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition">
          <span className="text-2xl">🤝</span>
          <span className="text-xs">Friends</span>
        </button>
        <button className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition relative">
          <span className="text-2xl">📊</span>
          <span className="text-xs">Activity</span>
          <span className="absolute top-0 right-2 w-2 h-2 bg-[#F9F871] rounded-full animate-pulse"></span>
        </button>
        <button className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition">
          <span className="text-2xl">👤</span>
          <span className="text-xs">Account</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
