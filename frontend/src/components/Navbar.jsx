import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Map, Bot, Compass, Navigation, Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${isHome ? 'text-gray-900' : 'text-white'}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-xl border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 flex flex-col space-y-4">
            <Link to="/explore" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600 font-medium py-2">Explore</Link>
            <Link to="/planner" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600 font-medium py-2">Planner</Link>
            <Link to="/map" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600 font-medium py-2">Map</Link>
            <Link to="/packing" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600 font-medium py-2">Packing AI</Link>
            <Link to="/chat" onClick={() => setIsOpen(false)} className="bg-indigo-600 text-white px-4 py-3 rounded-full flex items-center justify-center gap-2 font-semibold shadow-md mt-2">
              <Bot className="h-5 w-5" />
              AI Assistant
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
