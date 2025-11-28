import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import PWABadge from './PWABadge.jsx'
import './App.css'

import Dashboard from './pages/Dashboard'
import AnjemList from './pages/AnjemList'
import JastipList from './pages/JastipList'
import AddItem from './pages/AddItem'
import Profile from './pages/Profile'
import Header from './components/Header'

// Navigation moved into `Header` component; keep App focused on layout + routes

function App() {
  return (
    <div className="container">
      <Header />
      {/* duplicate nav removed; Header contains the navigation */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/anjem" element={<AnjemList />} />
        <Route path="/jastip" element={<JastipList />} />
        <Route path="/add" element={<AddItem />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <PWABadge />
    </div>
  )
}

export default App
