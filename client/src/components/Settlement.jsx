import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import SettlementGraph from './TransitionGraph';

const Settlement = ({selectedProject}) => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const fetchSettlements = async () => {
    const tokenType = localStorage.getItem("token_type");
    const token =
      tokenType === "user"
        ? localStorage.getItem("user_token")
        : localStorage.getItem("guest_token");

    const projectId = selectedProject?._id; 
    if(!projectId){
      setSettlements([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/transactions/settlement`, {
        params: projectId ? { projectId } : {}, 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const cleaned = (res.data.list || []).map((s) => ({
          from: s.from.trim(),
          to: s.to.trim(),
          amount: s.amount,
        }));
        setSettlements(cleaned);
      } else {
        toast.error(res.data.message || "Could not fetch settlements");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSettlements();
  }, [selectedProject]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <Loader2 className="animate-spin h-5 w-5 mr-2" />
        Loading settlements...
      </div>
    );
  }

return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        💰 Minimized Settlements
      </h2>

      <div className="space-y-4">
        {settlements.length === 0 ? (
          <p className="text-gray-500 text-center">
            Everyone is settled up! 🎉
          </p>
        ) : (
          <ul className="space-y-3">
            {settlements.map((s, i) => (
              <li
                key={i}
                className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center"
              >
                <span className="text-gray-700 text-base">
                  <span className="font-semibold text-blue-700">{s.from.charAt(0).toUpperCase() + s.from.slice(1)}</span>{" "}
                  pays{" "}
                  <span className="font-bold text-green-700">
                    ₹{s.amount}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-purple-700">{s.to.charAt(0).toUpperCase() + s.to.slice(1)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    {/* Placeholder for Graph */}
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex justify-center items-center min-h-[20rem]">
      <SettlementGraph settlements = {settlements}/>
    </div>
  </div>
);

};

export default Settlement;
