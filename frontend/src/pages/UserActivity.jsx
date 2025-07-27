import { useEffect, useState } from "react"
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

const Activity = () => {
  const [userTransactions, setUserTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user first
        const userResponse = await axios.get(`${API_URL}/users/profile`, {
          withCredentials: true
        });
        setCurrentUser(userResponse.data.user);

        // Then fetch transactions
        const transactionsResponse = await axios.get(`${API_URL}/trsn/getallbyUsr`, {
          withCredentials: true
        });
        setUserTransactions(transactionsResponse.data);
        setLoading(false);
        console.log(transactionsResponse.data);
      } catch (error) {
        setError(error.response);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return "yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getUserShare = (transaction, currentUserId) => {
    const userSplit = transaction.splitDetails.find(split => 
      split.user._id === currentUserId
    );
    return userSplit ? userSplit.share : 0;
  };

  const isExpense = (transaction, currentUserId) => {
    return transaction.payer._id === currentUserId;
  };

  const isIncome = (transaction, currentUserId) => {
    return transaction.payer._id !== currentUserId;
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

  if (userTransactions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6C4AB6]/30 to-[#8D72E1]/40 flex flex-col">
        <nav className="text-2xl font-bold py-4 px-6 bg-[#E9E9FE]/90 shadow-lg">
          <button 
            onClick={() => navigate("/dashboard")}
            className="mr-4 text-[#6C4AB6] hover:text-[#8D72E1] transition"
          >
            ←
          </button>
          Activities
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-[#6C4AB6]">
            <div className="text-6xl mb-4">📊</div>
            <div className="text-xl font-semibold">No transactions found</div>
            <div className="text-sm opacity-70">Start adding expenses to see your activity</div>
          </div>
        </div>
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
        <span className="text-[#6C4AB6]">Activities</span>
      </nav>

      {/* Activity List */}
      <div className="px-4 py-6 space-y-4">
        {userTransactions.map((transaction) => {
          const currentUserId = currentUser?._id;
          const userShare = getUserShare(transaction, currentUserId);
          const isExpenseTransaction = isExpense(transaction, currentUserId);
          const isIncomeTransaction = isIncome(transaction, currentUserId);

          return (
            <div 
              key={transaction._id} 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      isExpenseTransaction 
                        ? 'bg-red-500' 
                        : isIncomeTransaction 
                        ? 'bg-green-500' 
                        : 'bg-[#6C4AB6]'
                    }`}>
                      {isExpenseTransaction ? '💸' : isIncomeTransaction ? '💰' : '📊'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 text-lg">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-600">
                        in <span className="font-medium text-[#6C4AB6]">{transaction.group.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-13">
                    {isExpenseTransaction ? (
                      <div className="text-sm text-gray-600">
                        You paid <span className="font-semibold text-red-600">₹{transaction.amount}</span>
                        {userShare > 0 && (
                          <span className="text-gray-500"> • Your share: ₹{userShare}</span>
                        )}
                      </div>
                    ) : isIncomeTransaction ? (
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-green-600">₹{userShare}</span> back to you
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        Amount: <span className="font-semibold">₹{transaction.amount}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    isExpenseTransaction ? 'text-red-600' : 
                    isIncomeTransaction ? 'text-green-600' : 
                    'text-[#6C4AB6]'
                  }`}>
                    {isExpenseTransaction ? `-₹${userShare}` : 
                     isIncomeTransaction ? `+₹${userShare}` : 
                     `₹${transaction.amount}`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(transaction.createdAt)}
                  </div>
                </div>
              </div>
              
              {/* Split Details */}
              {transaction.splitDetails && transaction.splitDetails.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">Split details:</div>
                  <div className="flex flex-wrap gap-2">
                    {transaction.splitDetails.map((split, index) => (
                      <div 
                        key={split._id} 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          split.isPaid 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {split.user.username}: ₹{split.share}
                        {split.isPaid && ' ✓'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
          className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition relative"
        >
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
}

export default Activity;