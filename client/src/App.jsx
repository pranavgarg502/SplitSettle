import React from 'react'
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} /> 
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App