import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

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
        console.log(res);
        if (!res.data || !res.data.username) {
          navigate('/login');
        }
      } catch (e) {
        toast.error(e.response?.data?.message || "Authentication failed");
        navigate('/login');
      }
    };

    verifyUser();
  }, [navigate]);

  return (
    <div className="text-2xl font-bold p-6">
      Dashboard
    </div>
  );
};

export default Dashboard;
