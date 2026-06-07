import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Chatbot from './pages/Chatbot'
import TripPlanner from './pages/TripPlanner'
import InteractiveMap from './pages/InteractiveMap'
import StateExplorer from './pages/StateExplorer'
import StateDestinations from './pages/StateDestinations'
import PackingAssistant from './pages/PackingAssistant'

function App() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=80')" }}
    >
      <div className="min-h-screen bg-white/80 backdrop-blur-md">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<StateExplorer />} />
            <Route path="/explore/:stateName" element={<StateDestinations />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/packing" element={<PackingAssistant />} />
            <Route path="/map" element={<InteractiveMap />} />
            <Route path="/chat" element={<Chatbot />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
