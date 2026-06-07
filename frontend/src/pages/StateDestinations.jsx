import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Loader2, Sparkles, Navigation } from 'lucide-react';
import axios from 'axios';

const StateDestinations = () => {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const prompt = `Provide exactly 6 top tourist destinations in the Indian state of ${stateName}. Return ONLY a numbered list in this exact format, with absolutely no intro or outro text:
1. [Destination Name]: [One short, exciting sentence describing it.] | [Latitude],[Longitude]
2. [Destination Name]: [One short, exciting sentence describing it.] | [Latitude],[Longitude]`;

        const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://127.0.0.1:8000';
        const res = await axios.post(`${AI_API_URL}/api/chat`, { query: prompt });
        
        // Parse the response
        const lines = res.data.response.split('\n').filter(line => line.trim().length > 0);
        const parsed = lines.map((line, index) => {
          const mainParts = line.split('|');
          const textPart = mainParts[0] || line;
          const coordsPart = mainParts[1] ? mainParts[1].split(',') : ['20.5937', '78.9629'];
          
          const cleanLine = textPart.replace(/^\d+[\.\)]\s*/, '').replace(/\*\*/g, '').trim();
          const parts = cleanLine.split(':');
          return {
            id: index,
            name: parts[0] ? parts[0].trim() : `Destination ${index + 1}`,
            description: parts[1] ? parts.slice(1).join(':').trim() : cleanLine,
            lat: parseFloat(coordsPart[0]) || 20.5937,
            lng: parseFloat(coordsPart[1]) || 78.9629
          };
        }).filter(d => d.name !== d.description); 
        
        setDestinations(parsed.slice(0, 6)); 
      } catch (err) {
        setError('Failed to load destinations from AI. Please try again.');
      }
      setLoading(false);
    };

    fetchDestinations();
  }, [stateName]);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 px-4 relative overflow-hidden">
      {/* Background Blobs Removed for Professional UI */}
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <button 
          onClick={() => navigate('/explore')}
          className="flex items-center text-gray-500 hover:text-slate-900 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to States
        </button>

        <div className="flex items-center gap-3 mb-10">
          <Sparkles className="h-8 w-8 text-slate-900" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-900">{stateName}</span>
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500">
            <Loader2 className="h-12 w-12 animate-spin text-slate-900 mb-4" />
            <p className="text-lg animate-pulse">Our AI is uncovering the best spots in {stateName}...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={dest.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-200/50 to-slate-100/50 rounded-bl-full -z-10 transition-transform duration-500"></div>
                
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    onClick={() => navigate('/map', { state: { showPin: { name: dest.name, state: stateName, lat: dest.lat, lng: dest.lng } } })}
                    title="View on Map"
                    className="bg-slate-100 p-3 rounded-xl text-slate-700 hover:bg-slate-900 hover:text-white cursor-pointer transition-colors shadow-sm"
                  >
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{dest.name}</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-8 leading-relaxed flex-1">
                  {dest.description}
                </p>

                <button 
                  onClick={() => navigate('/planner', { state: { prefillDestination: `${dest.name}, ${stateName}` } })}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-slate-900 hover:text-white transition-colors mt-auto"
                >
                  <Navigation className="h-4 w-4" />
                  Plan Trip Here
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StateDestinations;
