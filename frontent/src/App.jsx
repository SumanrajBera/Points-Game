import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Leaderboard from './pages/Leaderboard'
import Dashboard from './pages/Dashboard'
import Ongoing from './pages/Ongoing'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./components/ProtectedRoute";
import GameView from './pages/GameView';


export default function App() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar toggleSidebar={() => setCollapsed(prev => !prev)} />
      <div className='main'>
        <Sidebar collapsed={collapsed} />
        <div className="content">
          <Routes>
            <Route path="/" element={<ProtectedRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path='/ongoing' element={<Ongoing />} />
              <Route path='/games/:gameId' element={<GameView />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  )
}
