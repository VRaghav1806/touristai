import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Sun, Calendar, Loader2, CheckSquare, Square, Sparkles } from 'lucide-react';
import axios from 'axios';
import LottieExport from 'lottie-react';
import { useEffect } from 'react';

const Lottie = LottieExport.default || LottieExport;

const PackingAssistant = () => {
  const [destination, setDestination] = useState('');
  const [month, setMonth] = useState('January');
  const [duration, setDuration] = useState(7);
  
  const [packingList, setPackingList] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Track checked state for items
  const [checkedItems, setCheckedItems] = useState({});
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/animations/tajmahal.json')
      .then(res => res.json())
      .then(data => setAnimationData(data));
  }, []);

  const generateList = async (e) => {
    e.preventDefault();
    if (!destination) return;
    
    setLoading(true);
    setError('');
    setCheckedItems({});
    setPackingList({});
    
    try {
      const prompt = `I am traveling to ${destination}, India in the month of ${month} for ${duration} days. 
CRITICAL INSTRUCTION: DO NOT provide a generic packing list. You MUST think about the specific geography, altitude, weather, and culture of ${destination} in ${month} and provide highly specialized items tailored to this exact trip.
Include unique items required for this environment (e.g., thermals and diamox for high altitude, bug spray and raincoats for monsoons, swimwear for beaches, modest clothing for temples).
Group the items strictly using the following format with absolutely no intro or outro text:

## 🎯 Destination Specifics (Crucial)
- Item 1: Why it is essential for ${destination} in ${month}
- Item 2: Why it is essential for ${destination} in ${month}

## 👕 Specialized Clothing
- Item 1: Reason
- Item 2: Reason

## 🎒 Gear & Essentials
- Item 1: Reason

## 🧴 Health & Toiletries
- Item 1: Reason`;

      const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://127.0.0.1:8000';
      const res = await axios.post(`${AI_API_URL}/api/chat`, { query: prompt });
      
      const text = res.data.response;
      const categories = {};
      let currentCategory = '';
      
      text.split('\n').forEach(line => {
        line = line.trim();
        if (line.startsWith('##')) {
          currentCategory = line.replace('##', '').replace(/\*\*/g, '').trim();
          categories[currentCategory] = [];
        } else if (line.startsWith('-') || line.startsWith('*')) {
          if (currentCategory) {
            categories[currentCategory].push(line.replace(/^[-*]\s*/, '').trim());
          }
        }
      });
      
      setPackingList(categories);
    } catch (err) {
      setError('Failed to generate packing list. Please try again.');
    }
    setLoading(false);
  };

  const toggleItem = (category, idx) => {
    const key = `${category}-${idx}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="h-screen pt-24 pb-8 relative flex flex-col">
      {/* Background Animation */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-50"></div>
        {animationData && (
          <Lottie 
            animationData={animationData} 
            loop={true} 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
            style={{ width: '100%', height: '100%' }}
          />
        )}
        <div className="absolute inset-0 bg-slate-800/10 backdrop-blur-[3px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/10 to-transparent pointer-events-none"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 w-full h-full flex flex-col">
        
        <div className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 shadow-2xl shadow-slate-900/10 border border-white/60 flex-1 overflow-y-auto flex flex-col scrollbar-hide">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Smart Packing Assistant
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Never forget the essentials. Tell us where you are going, and our AI will generate a perfectly tailored checklist based on the local weather, culture, and duration of your trip.
            </p>
          </div>

          <form onSubmit={generateList} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            <div className="md:col-span-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Destination in India</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Leh, Kerala, Jaipur..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-white/50"
                />
                <MapPinIcon className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Travel Month</label>
              <div className="relative">
                <select 
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all appearance-none bg-white/50"
                >
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <Sun className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Days</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="1"
                  max="60"
                  required
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-white/50"
                />
                <Calendar className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="md:col-span-12 mt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-slate-900/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2 text-lg transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <><Loader2 className="h-6 w-6 animate-spin" /> Analyzing Weather & Culture...</>
                ) : (
                  <><Sparkles className="h-6 w-6" /> Generate My Packing List</>
                )}
              </button>
            </div>
            
          </form>

          {error && (
            <div className="text-center text-red-500 bg-red-50 py-4 rounded-xl mt-8 border border-red-100 shrink-0">
              {error}
            </div>
          )}

          {Object.keys(packingList).length > 0 && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mt-12 shrink-0 pb-8"
            >
              {Object.entries(packingList).map(([category, items], catIdx) => (
                <div key={category} className="bg-white/80 rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100 flex items-center">
                    <div className="h-8 w-1 bg-slate-900 rounded-full mr-3"></div>
                    {category}
                  </h3>
                  
                  <div className="space-y-3">
                    {items.map((item, idx) => {
                      const isChecked = checkedItems[`${category}-${idx}`];
                      return (
                        <div 
                          key={idx}
                          onClick={() => toggleItem(category, idx)}
                          className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isChecked ? 'bg-gray-50 opacity-60' : 'hover:bg-white/80'}`}
                        >
                          <div className={`mt-0.5 transition-colors ${isChecked ? 'text-slate-900' : 'text-gray-400'}`}>
                            {isChecked ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                          </div>
                          <span className={`text-gray-700 leading-relaxed transition-all ${isChecked ? 'line-through text-gray-400' : ''}`}>
                            {item}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};

// Mini helper component for missing lucide icon
const MapPinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

export default PackingAssistant;
