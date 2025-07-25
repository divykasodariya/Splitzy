import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { useParams } from 'react-router-dom';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [groupPhoto, setGroupPhoto] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    // alert("Group creation is not yet supported.");
    const response = await axios.post(`${API_URL}/groups/create`,{
     name: groupName,
      
    },{
      withCredentials: true,
    });
    if(response.status === 200){
      navigate("/dashboard");
    }
    else{
      alert("Group creation failed");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <>
    {/* <nav className="flex justify-between bg-[#E9E9FE]/90 items-center h-16 p-4 gap-2 bg-[#6C4AB6]/10 shadow-lg ring-1 ring-black/5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-[#6C4AB6] drop-shadow-lg text-shadow-white-500">
            Splitzy
          </h1>
        </div>
      </nav> */}
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#6C4AB6]/30 to-[#8D72E1]/40">
        
      <div className="flex flex-col items-center justify-center max-w-sm w-80 p-6 rounded-2xl border-1 border-[#2D2D2D] border-opacity-30 bg-[#FFF7ED]/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[3.6px]">
        <h1 className="text-3xl text-[#2D2D2D] font-bold text-center mb-6">Create Group</h1>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Group Name"
            className="w-full p-2 rounded-md border border-gray-300 outline-[#6C4AB6] focus:ring-2 focus:ring-[#8D6BD9] focus:border-transparent outline-none"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <label className="block text-sm text-gray-600 font-medium">Group Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 rounded-md border border-gray-300 bg-white/80 cursor-not-allowed"
            disabled
            onChange={(e) => setGroupPhoto(e.target.files[0])}
          />
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 p-2 bg-[#6C4AB6] text-white rounded-lg font-semibold hover:bg-[#8D72E1] transition"
            >
              Create
            </button>
            <button
              type="button"
              className="flex-1 p-2 bg-gray-200 text-[#6C4AB6] rounded-lg font-semibold hover:bg-gray-300 transition"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
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
    </>
  );
};

export default CreateGroup; 