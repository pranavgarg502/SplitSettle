import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Settlement from '@/components/Settlement.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const [giver, setGiver] = useState("");
  const [reciever, setReciever] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [list, setList] = useState([]);

  const transactionListFind = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5001/api/transactions/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) setList(res.data.list);
    } catch (e) {
      toast.error(e.response?.data?.message || "History Ain't Accessible");
    }
  };

  const deleteBtnHandler = (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    axios.delete(`http://localhost:5001/api/transactions/remove/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.data.success) {
          toast.success("Transaction deleted successfully");
          setList(prev => prev.filter(item => item._id !== id));
        } else {
          toast.error(res.data.message || "Failed to delete");
        }
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Deletion failed");
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const verifyUser = async () => {
      if (!token) {
        toast.error("Not logged in");
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get("http://localhost:5001/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data?.success) {
          navigate('/login');
        }
      } catch (e) {
        toast.error(e.response?.data?.message || "Authentication failed");
        navigate('/login');
      }
    };

    verifyUser();
  }, [navigate]);

  useEffect(() => {
    transactionListFind();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!giver || !reciever || !amount) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5001/api/transactions/add", {
        giver,
        reciever,
        amount,
        description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Transaction Added Successfully");
        setGiver(""); setReciever(""); setAmount(""); setDescription("");
        transactionListFind();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add transaction");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">💰 Ease Your Payments</h1>
        
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="flex justify-center gap-4 bg-white shadow-md rounded-md p-2 mb-6">
            <TabsTrigger value="transactions" className="px-4 py-2 rounded-md data-[state=active]:bg-green-500 data-[state=active]:text-white font-medium">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="settlements" className="px-4 py-2 rounded-md data-[state=active]:bg-green-500 data-[state=active]:text-white font-medium">
              Settlements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-1/2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input value={giver} onChange={e => setGiver(e.target.value)} placeholder="Enter giver's name" />
                  <Input value={reciever} onChange={e => setReciever(e.target.value)} placeholder="Enter receiver's name" />
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />
                  <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="What was this transaction for?" />
                  <Button type="submit" className="w-full">Add Transaction</Button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-1/2 max-h-[32rem] overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h2>
                {list.length > 0 ? (
                  list.map((item, index) => (
                    <div key={index} className="border-b py-3">
                      <p className="text-gray-800 font-medium">
  {item.giverName} <span className="font-bold">Has to Pay</span> {item.recieverName} ₹{item.amount}
</p>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <p>{item.description}</p>
                        <Button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1" onClick={() => deleteBtnHandler(item._id)}>Delete</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No transactions yet.</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settlements">
              <Settlement/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
