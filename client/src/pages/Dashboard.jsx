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
import ProjectSidebar from '@/components/ProjectSidebar';
import { Menu } from 'lucide-react';

const capitalizeFirst = (str) =>
  str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();

const Dashboard = () => {
  const navigate = useNavigate();
  const [giver, setGiver] = useState("");
  const [reciever, setReciever] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [list, setList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
    const API_URL = import.meta.env.VITE_BACKEND_URL;
  function logOutBtnHandler() {
    const type = localStorage.getItem("token_type");
    localStorage.removeItem("token_type");
    if (type === "user") localStorage.removeItem("user_token");
    navigate(type === "guest" ? "/" : "/login");
  }
  useEffect(() => {
    if (selectedProject) {
      transactionListFind();
    }
  }, [selectedProject]);

  const transactionListFind = async () => {
    if (!selectedProject?._id) {
      setList([]); 
      return;
    }

    const tokenType = localStorage.getItem("token_type");
    const token =
      tokenType === "user"
        ? localStorage.getItem("user_token")
        : localStorage.getItem("guest_token");

    try {
      const res = await axios.get(`${API_URL}/api/projects/list`, {
        params: { projectId: selectedProject._id },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) setList(res.data.list);
    } catch (e) {
      toast.error(e.response?.data?.message || "History Ain't Accessible");
    }
  };



  const deleteBtnHandler = (id) => {
    const tokenType = localStorage.getItem("token_type");
    const token =
      tokenType === "user"
        ? localStorage.getItem("user_token")
        : localStorage.getItem("guest_token");

    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    axios.delete(`${API_URL}/api/transactions/remove/${id}`, {
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
    const tokenType = localStorage.getItem("token_type");
    const token =
      tokenType === "user"
        ? localStorage.getItem("user_token")
        : localStorage.getItem("guest_token");

    const verifyUser = async () => {
      try {
        if (token) {
          const res = await axios.get(`${API_URL}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.data?.success) navigate('/login');
        }
      } catch (e) {
        toast.error(e.response?.data?.message || "Authentication failed");
        navigate('/login');
      }
    };

    verifyUser();
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!giver || !reciever || !amount) {
      toast.error("Please fill all fields");
      return;
    }

    const tokenType = localStorage.getItem("token_type");
    const token =
      tokenType === "user"
        ? localStorage.getItem("user_token")
        : localStorage.getItem("guest_token");

    try {
    const res = await axios.post(
      `${API_URL}/api/transactions/add`,
      {
        giver: giver.trim().toLowerCase(),
        reciever: reciever.trim().toLowerCase(),
        amount,
        description,
        projectId: selectedProject?._id, 
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );


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
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

        {!sidebarOpen && (
          <div className="fixed top-4 left-4 z-50 flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md bg-gray-200 hover:bg-gray-300">
              <Menu className="w-6 h-6" />
            </button>

  
            {selectedProject && (
              <span className="hidden md:inline text-sm font-medium text-green-700 bg-white px-3 py-1 rounded shadow">
                📁 {selectedProject.name}
              </span>
            )}
          </div>

        )}


      {/* Clickable Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <ProjectSidebar
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        open={sidebarOpen}
      />
      {/* Main Page Content */}
      <main className= "relative z-10 px-6 py-8">
          <div className="relative -mt-4 flex items-center justify-end mb-8">
            <h1 className="absolute  left-1/2 -translate-x-1/2 text-3xl font-bold text-green-700">
              💰 Split Settle
            </h1>

            {/* Logout Button aligned to the right */}
            <Button
              onClick={logOutBtnHandler}
              className="text-black bg-white hover:bg-gray-200"
            >
              Logout
            </Button>
          </div>



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
                        {capitalizeFirst(item.giverName)} <span className="font-bold">Has to Pay</span> {capitalizeFirst(item.recieverName)} ₹{item.amount}
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
            <Settlement selectedProject={selectedProject} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
