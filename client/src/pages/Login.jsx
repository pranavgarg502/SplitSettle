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

  async function clickHandler(e) {
    e.preventDefault();

    if (isLogin) {
      // 🔐 Login
      try {
        const res = await axios.post("http://localhost:5001/api/auth/login", {
          username,
          password,
        });

        localStorage.setItem("token", res.data.token); // Save JWT
        
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
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Toaster position="top-center" />
      <div className="rounded-md bg-white p-8 shadow-md w-full max-w-sm">
        <h2 className="text-center text-gray-700 text-2xl font-bold mb-6">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        <form onSubmit={clickHandler} className="flex flex-col gap-4">
          {!isLogin && (
            <Input type="text" onChange = {(e)=>setName(e.target.value)} value = {name} placeholder="Full Name" />
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
        </form>
      </div>
    </div>
  );
};

export default Login;
