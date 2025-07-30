import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import axios from "axios";

const TransactionDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    description: "",
    amount: 0,
    category: "",
    notes: ""
  });

  // Fetch transaction data
  useEffect(() => {
    fetchTransaction();
  }, [id]);
useEffect(()=>{
  console.log(transaction);
},[transaction]);
    const fetchTransaction = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/trsn/getallbyusr`, {
        withCredentials: true,
      });
      console.log(response.data);
      const foundTransaction = response.data.find(t => t._id === id);
      
      if (!foundTransaction) {
        setError("Transaction not found");
        setLoading(false);
        return;
      }

      setTransaction(foundTransaction);
      setEditForm({
        description: foundTransaction.description,
        amount: Math.abs(foundTransaction.amount),
       
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      setError("Failed to load transaction");
      setLoading(false);
    }
  };

  // Handle edit functionality
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      // Note: Backend doesn't have update transaction API yet
      // This is a demo function that would need a new API endpoint
      console.log("Saving edited transaction:", editForm);
      
      // For now, just update local state
      setTransaction({
        ...transaction,
        description: editForm.description,
        amount: -editForm.amount,
        category: editForm.category,
        notes: editForm.notes,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction");
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      category: transaction.category || "Other",
      notes: transaction.notes || ""
    });
    setIsEditing(false);
  };

  // Handle settle up functionality

  const handleMarkAsPaid = async (splitId) => {
    try {
      const split = transaction.splitDetails.find(s => s._id === splitId);
      if (!split) {
        console.error("Split not found:", splitId);
        return;
      }

     

      const response = await axios.post(`${API_URL}/trsn/settle`, {
        transid: transaction._id,
        splitId: splitId
      }, {
        withCredentials: true,
      });

     
      if (response.data.success) {
        // Option 1: Update local state immediately for better UX
        setTransaction({
          ...transaction,
          splitDetails: transaction.splitDetails.map(s => 
            s._id === splitId 
              ? { ...s, isPaid: true }
              : s
          )
        });

        // Option 2: Refresh data from server to ensure consistency
       
        // console.log("Settlement successful, updated local state");
      } else {
        console.error("Settlement failed:", response.data);
        alert("Failed to mark as paid: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error marking as paid:", error);
      console.error("Error details:", error.response?.data);
      alert("Failed to mark as paid: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteTransaction = async () => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const response = await axios.delete(`${API_URL}/trsn/delete/${transaction._id}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          alert("Transaction deleted successfully");
          navigate(-1);
        } else {
          alert("Failed to delete transaction");
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Failed to delete transaction: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

 

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6C4AB6]/30 to-[#8D72E1]/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4AB6] mx-auto mb-4"></div>
          <p className="text-[#6C4AB6] font-medium">Loading transaction...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6C4AB6]/30 to-[#8D72E1]/40 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-[#6C4AB6] font-medium mb-4">{error || "Transaction not found"}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#6C4AB6] text-white px-6 py-2 rounded-lg hover:bg-[#8D72E1] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6C4AB6]/30 to-[#8D72E1]/40 flex flex-col relative">
      {/* Header */}
      <nav className="flex justify-between bg-[#E9E9FE]/90 items-center h-16 p-4 gap-2 bg-[#6C4AB6]/10 shadow-lg ring-1 ring-black/5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C4AB6" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-xl font-bold text-[#6C4AB6]">Transaction Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleEdit}
            className="p-2 rounded-lg bg-[#6C4AB6]/10 hover:bg-[#6C4AB6]/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C4AB6" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button 
            onClick={handleDeleteTransaction}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Transaction Card */}
      <div className="mx-4 mt-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          {/* Transaction Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
             
              <div>
                <h2 className="text-xl font-bold text-[#2D2D2D]">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    transaction.description
                  )}
                </h2>
                <p className="text-sm text-gray-500">
                  {formatDate(transaction.createdAt)}
                </p>
              </div>
            </div>
            <div className={`text-2xl font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.currency} {Math.abs(transaction.amount).toLocaleString()}
            </div>
          </div>

          {/* Group Info */}
          {transaction.group && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
                {/* {transaction.group.name ? transaction.group.name[0].toUpperCase() : 'G'} */}
                <img src={transaction.group.groupAvatar} alt="G" className=" text-black/50 w-8 h-8 rounded-lg" />
              </div>
              <span className="text-sm text-gray-600">Group: {transaction.group.name || 'Unknown Group'}</span>
            </div>
          )}

          {/* Payer Info */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-[#d7a3ff]/20 rounded-lg">
            <div className="w-8 h-8  rounded-full flex items-center justify-center text-black/50 font-bold">
              {/* {transaction.payer?.username ? transaction.payer.username[0].toUpperCase() : 'U'} */}
              <img src={transaction.payer.avatar} alt="U" className="w-8 h-8 rounded-lg" />
            </div>
            <span className="text-sm text-gray-600">
              Paid by <span className="font-semibold">{transaction.payer?.username || 'Unknown User'}</span>
            </span>
          </div>

          {/* Category and Notes */}
          {/* <div className="space-y-3 mb-4">
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Travel">Travel</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Category:</span>
                <span className="text-sm font-medium">{transaction.category || "Other"}</span>
              </div>
            )}

            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>
            ) : (
              transaction.notes && (
                <div>
                  <span className="text-sm text-gray-500">Notes:</span>
                  <p className="text-sm mt-1">{transaction.notes}</p>
                </div>
              )
            )}
          </div> */}

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

                {/* Split Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-[#2D2D2D] mb-4">Split Details</h3>
          <div className="space-y-3">
            {transaction.splitDetails && transaction.splitDetails.length > 0 ? (
              transaction.splitDetails.map((split) => (
                <div key={split._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10  rounded-full flex items-center justify-center text-black/50 font-bold">
                      {/* {split.user?.username ? split.user.username[0].toUpperCase() : 'U'} */}
                      <img src={split.user.avatar} alt={split.user.username[0].toUpperCase()} className="w-10 h-10 rounded-full" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2D2D2D]">{split.user?.username || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">
                        owes {transaction.currency} {split.share.toLocaleString()}
                      </p>
                      {split.isPaid && (
                        <p className="text-xs text-green-600">
                          Paid
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      split.isPaid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {split.isPaid ? 'Paid' : 'Pending'}
                    </span>
                    {!split.isPaid && (
                      <button
                        onClick={() => handleMarkAsPaid(split._id)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No split details available
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-4">
          <h3 className="text-lg font-bold text-[#2D2D2D] mb-4">Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-green-600">
                {transaction.currency} {Math.abs(transaction.amount).toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Split Between</p>
               <p className="text-xl font-bold text-blue-600">
                {transaction.splitDetails ? transaction.splitDetails.length : 0} people
              </p> 
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Paid</p>
             <p className="text-xl font-bold text-green-600">
                {transaction.splitDetails ? transaction.splitDetails.filter(s => s.isPaid).length : 0}
              </p> 
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
               <p className="text-xl font-bold text-red-600">
                {transaction.splitDetails ? transaction.splitDetails.filter(s => !s.isPaid).length : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-4 mb-20">
          <h3 className="text-lg font-bold text-[#2D2D2D] mb-4">Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Transaction created</p>
                <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
              </div>
            </div>
            {transaction.updatedAt && transaction.updatedAt !== transaction.createdAt && (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Transaction updated</p>
                  <p className="text-xs text-gray-500">{formatDate(transaction.updatedAt)}</p>
                </div>
              </div>
            )}
            {transaction.splitDetails && transaction.splitDetails.filter(s => s.isPaid).map((split) => (
              <div key={split._id} className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">{split.user?.username || 'Unknown User'} paid their share</p>
                  <p className="text-xs text-gray-500">Recently</p>
                </div>
              </div>
            ))}
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
          className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition relative"
        >
          <span className="text-2xl">📊</span>
          <span className="text-xs">Activity</span>
          <span className="absolute top-0 right-2 w-2 h-2 bg-[#F9F871] rounded-full animate-pulse"></span>
        </button>
        <button 
          onClick={() => navigate("/dashboard/profile")} 
          className="flex flex-col items-center text-[#6C4AB6] font-bold hover:text-[#8D72E1] transition"
        >
          <span className="text-2xl">👤</span>
          <span className="text-xs">Account</span>
        </button>
      </nav>
    </div>
  );
};

export default TransactionDashboard;