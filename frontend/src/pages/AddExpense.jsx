import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const AddExpense = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [groupInfo, setGroupInfo] = useState(null);
  const [expense, setExpense] = useState({
    description: "",
    amount: "",
    currency: "INR",
    paidBy: "",
    splitType: "equally", // "equally" or "custom"
    selectedUsers: [], // for custom split
  });

  const currencies = ["INR", "USD", "EUR", "GBP"];

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(`${API_URL}/groups/info/${id}`, {
          withCredentials: true,
        });
        setGroupInfo(response.data.data);
        // Set default paid by to first user
        if (response.data.data.users.length > 0) {
          setExpense(prev => ({
            ...prev,
            paidBy: response.data.data.users[0]._id,
            selectedUsers: response.data.data.users.map(user => user._id)
          }));
        }
      } catch (error) {
        console.error("Error fetching group info:", error);
      }
    };
    fetchGroup();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expense.description || !expense.amount || !expense.paidBy) {
      alert("Please fill all required fields");
      return;
    }
    if(expense.amount<=0){
        alert("Amount must be greater than 0");
        return;
    }
    if(expense.selectedUsers.length===0){
        alert("Please select at least one user");
        return;
    }
    if(expense.splitType==="custom" && expense.selectedUsers.length===0)
    try {
        let splitDetails=[];
        for(let i=0;i<expense.selectedUsers.length;i++){
            let isPaid=false;
            if(expense.selectedUsers[i]===expense.paidBy){
                isPaid=true;
            }
            const split= {
                user: expense.selectedUsers[i],
                share: (expense.amount/expense.selectedUsers.length).toFixed(2),
                isPaid: isPaid,
            }
            splitDetails.push(split);
        }

      const expenseData = {
        groupid: id,
        description: expense.description,
        amount: parseFloat(expense.amount),
        payer: expense.paidBy,
        splitDetails: splitDetails,
        currency: expense.currency,
      };
      console.log(expenseData);
      const response = await axios.post(`${API_URL}/trsn/add`, expenseData, {
        withCredentials: true,
      });

      if (response.data.success) {
        navigate(`/dashboard/group/${id}`);
      }
    } catch (error) {
      alert("Failed to add expense");
      console.error("Error adding expense:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/group/${id}`);
  };

  const toggleUserSelection = (userId) => {
    setExpense(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId)
        : [...prev.selectedUsers, userId]
    }));
  };

  if (!groupInfo) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#6C4AB6]/30 to-[#8D72E1]/40">
      <div className="flex flex-col items-center justify-center max-w-sm w-80 p-6 rounded-2xl border-1 border-[#2D2D2D] border-opacity-30 bg-[#FFF7ED]/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[3.6px]">
        <h1 className="text-3xl text-[#2D2D2D] font-bold text-center mb-6">Add Expense</h1>
        
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          {/* Description */}
          <input
            type="text"
            placeholder="Description"
            className="w-full p-2 rounded-md border  border-gray-300 outline-[#6C4AB6] focus:ring-2 focus:ring-[#8D6BD9] focus:border-transparent outline-none"
            value={expense.description}
            onChange={(e) => setExpense(prev => ({ ...prev, description: e.target.value }))}
            required
          />

          {/* Amount and Currency */}
          <div className="grid grid-cols-2  gap-2 ">
            <input
              type="number"
              placeholder="Amount"
              className="flex-1 p-2 rounded-md border border-gray-300 outline-[#6C4AB6] focus:ring-2 focus:ring-[#8D6BD9] focus:border-transparent outline-none"
              value={expense.amount}
              onChange={(e) => setExpense(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
            <select
              className="p-2 text-[#2D2D2D]-500 rounded-md border border-gray-300 outline-[#6C4AB6] focus:ring-2 focus:ring-[#8D6BD9] focus:border-transparent outline-none bg-white/90"
              value={expense.currency}
              onChange={(e) => setExpense(prev => ({ ...prev, currency: e.target.value }))}
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>

          {/* Paid By */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#2D2D2D] font-medium">Paid by</label>
            <select
              className="w-full p-2 rounded-md border border-gray-300 outline-[#6C4AB6] focus:ring-2 focus:ring-[#8D6BD9] focus:border-transparent outline-none bg-white/90"
              value={expense.paidBy}
              onChange={(e) => setExpense(prev => ({ ...prev, paidBy: e.target.value }))}
              required
            >
              {groupInfo.users.map(user => (
                <option key={user._id} value={user._id}>{user.username}</option>
              ))}
            </select>
          </div>

          {/* Split Options */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#2D2D2D] font-medium">Split</label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 p-2 rounded-md border font-medium transition ${
                  expense.splitType === "equally"
                    ? "bg-[#6C4AB6] text-white border-[#6C4AB6]"
                    : "bg-white/90 text-[#6C4AB6] border-gray-300"
                }`}
                onClick={() => setExpense(prev => ({ ...prev, splitType: "equally" }))}
              >
                Equally
              </button>
              <button
                type="button"
                className={`flex-1 p-2 rounded-md border font-medium transition ${
                  expense.splitType === "custom"
                    ? "bg-[#6C4AB6] text-white border-[#6C4AB6]"
                    : "bg-white/90 text-[#6C4AB6] border-gray-300"
                }`}
                onClick={() => setExpense(prev => ({ ...prev, splitType: "custom" }))}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Custom Split Users */}
          {expense.splitType === "custom" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#2D2D2D] font-medium">Select users to split with:</label>
              <div className="flex flex-wrap gap-2">
                {groupInfo.users.map(user => (
                  <button
                    key={user._id}
                    type="button"
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      expense.selectedUsers.includes(user._id)
                        ? "bg-[#6C4AB6] text-white"
                        : "bg-white text-[#6C4AB6] border border-gray-300"
                    }`}
                    onClick={() => toggleUserSelection(user._id)}
                  >
                    {user.username}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 p-2 bg-[#6C4AB6] text-white rounded-lg font-semibold hover:bg-[#8D72E1] transition"
            >
              Add
            </button>
            <button
              type="button"
              className="flex-1 p-2 bg-white/80 text-[#6C4AB6] rounded-lg font-semibold hover:bg-gray-300 transition"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
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
        <button className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition relative">
          <span className="text-2xl">📊</span>
          <span className="text-xs">Activity</span>
          <span className="absolute top-0 right-2 w-2 h-2 bg-[#F9F871] rounded-full animate-pulse"></span>
        </button>
        <button onClick={() => navigate("/dashboard/profile")} className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition">
          <span className="text-2xl">👤</span>
          <span className="text-xs">Account</span>
        </button>
      </nav>
    </div>
  );
};

export default AddExpense;