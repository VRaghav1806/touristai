import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Map, Bot, Compass, Navigation } from 'lucide-react'

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${isHome ? 'bg-white/80 backdrop-blur-md border-b border-gray-100/50' : 'bg-slate-900 shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Compass className={`h-7 w-7 ${isHome ? 'text-slate-900' : 'text-white'}`} />
            <Link to="/" className={`text-xl font-bold tracking-tight ${isHome ? 'text-gray-900' : 'text-white'}`}>
              TouristAI
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/explore" className={`text-sm font-medium transition-colors ${isHome ? 'text-gray-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}>Explore</Link>
            <Link to="/planner" className={`text-sm font-medium transition-colors ${isHome ? 'text-gray-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}>Planner</Link>
            <Link to="/map" className={`text-sm font-medium transition-colors ${isHome ? 'text-gray-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}>Map</Link>
            <Link to="/packing" className={`text-sm font-medium transition-colors ${isHome ? 'text-gray-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}>Packing AI</Link>
            
            <Link to="/chat" className={`text-sm px-5 py-2 rounded-full flex items-center gap-2 transition-colors shadow-sm font-semibold ${isHome ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-gray-100'}`}>
              <Bot className="h-5 w-5" />
              AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
