import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Wallet, Navigation } from 'lucide-react';
import axios from 'axios';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import LottieExport from 'lottie-react';
import { useEffect } from 'react';

const Lottie = LottieExport.default || LottieExport;

const TripPlanner = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    destination: location.state?.prefillDestination || '',
    days: 3,
    budget: 'Moderate'
  });
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const itineraryRef = useRef(null);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/animations/hills.json')
      .then(res => res.json())
      .then(data => setAnimationData(data));
  }, []);

  const handleDownloadPDF = async () => {
    const element = itineraryRef.current;
    if (!element) return;
    
    try {
      const dataUrl = await toPng(element, { backgroundColor: '#ffffff', pixelRatio: 2 });
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight]
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
      pdf.save(`TouristAI-Itinerary-${formData.destination}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItinerary('');
    
    try {
      const query = `Plan a ${formData.days}-day trip to ${formData.destination} with a ${formData.budget} budget. Include hotels, restaurants, and daily activities.`;
      const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://127.0.0.1:8000';
      const res = await axios.post(`${AI_API_URL}/api/chat`, { query });
      setItinerary(res.data.response);
    } catch (error) {
      setItinerary('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative flex flex-col px-4">
      {/* Background Animation */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-50"></div>
        {animationData && (
          <Lottie 
            animationData={animationData} 
            loop={true} 
            className="absolute inset-0 w-full h-full object-cover"
            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
            style={{ width: '100%', height: '100%' }}
          />
        )}
        <div className="absolute inset-0 bg-slate-800/10 backdrop-blur-[3px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/10 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 w-full">
        
        {/* Planner Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <Navigation className="h-6 w-6 text-slate-900" />
            Smart Trip Planner
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Destination
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g., Rajasthan, Kerala, Goa"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Number of Days
              </label>
              <input 
                type="number" 
                min="1" max="14"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                value={formData.days}
                onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Wallet className="h-4 w-4" /> Budget Style
              </label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              >
                <option value="Budget">Budget Backpacking</option>
                <option value="Moderate">Moderate Comfort</option>
                <option value="Luxury">Luxury & Premium</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {loading ? 'Generating Itinerary...' : 'Generate AI Itinerary'}
            </button>
          </form>
        </motion.div>

        {/* Output Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[500px] md:h-[calc(100vh-10rem)] overflow-y-auto"
        >
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <p className="animate-pulse">Analyzing millions of data points to craft your perfect trip...</p>
            </div>
          ) : itinerary ? (
            <div className="prose max-w-none">
              <div ref={itineraryRef} className="p-4 bg-white rounded-lg">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Your AI Generated Itinerary</h3>
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {itinerary}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 px-4">
                <button className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                  Save Trip to Profile
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="px-6 py-2.5 bg-white text-slate-700 border border-slate-200 font-medium rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                >
                  Download as PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Navigation className="h-16 w-16 mb-4 text-gray-200" />
              <p>Enter your details to generate a personalized AI itinerary.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TripPlanner;
