import React, { useEffect, useState } from 'react';
import toast , {Toaster} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [giver, setGiver] = useState("");
  const [reciever, setReciever] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [list , setList] = useState([]);
  const transactionListFind = async () => {
    const token = localStorage.getItem("token"); // move it inside
    try {
      const res = await axios.get("http://localhost:5001/api/transactions/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      console.log(res);
      if (res.data?.success) {
        setList(res.data.list);
      }
    } 
    catch (e) {
      toast.error(e.response?.data?.message || "History Ain't Accessible");
    }
  };

  function deleteBtnHandler(id) {
    const token = localStorage.getItem("token");
    
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    axios.delete(`http://localhost:5001/api/transactions/remove/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
  }
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(res.data.success){
        toast.success("Transaction Added Successfully");
        setGiver("");
        setReciever("");
        setAmount("");
        setDescription("");

        transactionListFind();

      }
      else{
        toast.error(res.data.message);
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add transaction");
    }
    
  };

  return (
    <div className="w-screen h-screen p-6 flex items-center bg-gray-100">
       <Toaster position="top-right" reverseOrder={false} />
      <div className='flex flex-row w-screen justify-evenly'>
        <div className="flex flex-col gap-6 w-full max-w-xl rounded-md shadow-lg bg-white p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Add New Transaction</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700 font-medium">Giver's Name</label>
              <Input
                type="text"
                value={giver}
                onChange={(e) => setGiver(e.target.value)}
                placeholder="Enter Giver's Name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700 font-medium">Reciever's Name</label>
              <Input
                type="text"
                value={reciever}
                onChange={(e) => setReciever(e.target.value)}
                placeholder="Enter Receiver's Name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700 font-medium">Amount</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700 font-medium">Description</label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this transaction for?"
              />
            </div>

            <Button type="submit" className="mt-4 w-full">
              Add Transaction
            </Button>
          </form>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-xl rounded-md shadow-lg bg-white p-8 max-h-[32rem] overflow-y-auto ">
            <h2 className="text-2xl font-semibold text-center text-gray-800">Transaction History</h2>
              {list.length > 0 ? (
                list.map((item, index) => (
                  <div key={index} className="border p-3 rounded-md shadow-sm bg-gray-50">
                    <p className="text-gray-800 font-medium">
                      {item.giverName}  PAID  {item.recieverName}  ₹{item.amount}
                    </p>
                    <div className='flex flex-row justify-between'>
                      <p className="text-sm text-gray-500">{item.description}</p>
                      <Button onClick = {()=> deleteBtnHandler(item?._id)} className = "bg-red-500 text-sm p-2" >Delete</Button>
                    </div>

                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center">No transactions yet.</p>
              )}


        </div>
      </div>
    </div>
  );
};

export default Dashboard;
