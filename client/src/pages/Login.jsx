import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name , setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleGuestLogin() {
    const existingToken = localStorage.getItem("guest_token");

    if (existingToken && existingToken.startsWith("guest_")) {
      localStorage.setItem("token_type", "guest");
      navigate("/dashboard");
      return;
    }

    const guestToken = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem("guest_token", guestToken);
    localStorage.setItem("token_type", "guest");
    navigate("/dashboard");
  }

  async function clickHandler(e) {
    e.preventDefault();

    if (isLogin) {
      // 🔐 Login
      try {
        const res = await axios.post("http://localhost:5001/api/auth/login", {
          username,
          password,
        });

        localStorage.setItem("user_token", res.data.token); // Save JWT
        localStorage.setItem("token_type", "user");
        if (res.data.token) {
          toast.success("Logged in Successfully");
        } else {
          toast.error(res.data.message || "Login failed");
        }
      } catch (e) {
        console.error("Login failed:", e.response?.data?.message || e.message);
        toast.error(e.response?.data?.message || "Login failed");
      }
      navigate('/dashboard');
    } else {
      // 🆕 Register
      try {
        const res = await axios.post("http://localhost:5001/api/auth/register", {
          name,
          username,
          password,
        });

        if (res.data.success) {
          toast.success("Registered Successfully");
          setIsLogin(true); // switch to login
        } else {
          toast.error(res.data.message || "Registration failed");
        }
        setIsLogin(true);
      } catch (e) {
        console.error("Register failed:", e.response?.data?.message || e.message);
        toast.error(e.response?.data?.message || "Register failed");
      }
    }
  }
return (
  <div className="min-h-screen flex flex-col bg-gray-100">
    <div className="w-full py-6 bg-white shadow-md">
      <h1 className="text-3xl font-bold text-center text-green-700">
        💰 Split Settle
      </h1>
    </div>

    <div className="flex-grow flex justify-center items-center">
      <Toaster position="top-center" />
      <div className="rounded-md bg-white p-8 shadow-md w-full max-w-sm">
        <h2 className="text-center text-gray-700 text-2xl font-bold mb-6">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        <form onSubmit={clickHandler} className="flex flex-col gap-4">
          {!isLogin && (
            <Input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Full Name"
            />
          )}
          <Input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            placeholder="Username"
          />
          <Input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
          />

          <Button type="submit">
            {isLogin ? 'Sign in' : 'Register'}
          </Button>

          <div className="text-sm text-center mt-2">
            {isLogin ? (
              <>
                Need to register?{' '}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => setIsLogin(true)}
                >
                  Sign in
                </span>
              </>
            )}
          </div>

          <div className="text-sm text-center mt-2">
              <div>
                Dont Want to Login?{' '}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={handleGuestLogin}
                >
                  Continue as Guest
                </span>
              </div>
          
          </div>
        </form>
      </div>
    </div>
  </div>
);



};

export default Login;
