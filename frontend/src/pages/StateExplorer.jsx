import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Map as MapIcon, ArrowRight } from 'lucide-react';
import stateImages from '../data/state_images.json';

const statesData = [
  // States
  { id: 1, name: 'Andhra Pradesh', tagline: 'The Essence of Incredible India', color: 'from-blue-400 to-indigo-500' },
  { id: 2, name: 'Arunachal Pradesh', tagline: 'The Land of Dawn-lit Mountains', color: 'from-emerald-400 to-green-600' },
  { id: 3, name: 'Assam', tagline: 'The Awesome Assam', color: 'from-green-500 to-emerald-700' },
  { id: 4, name: 'Bihar', tagline: 'Blissful Bihar', color: 'from-yellow-400 to-orange-500' },
  { id: 5, name: 'Chhattisgarh', tagline: 'Full of Surprises', color: 'from-green-400 to-teal-500' },
  { id: 6, name: 'Goa', tagline: 'Pearl of the Orient', color: 'from-blue-400 to-cyan-500' },
  { id: 7, name: 'Gujarat', tagline: 'Vibrant Gujarat', color: 'from-saffron to-orange-500' },
  { id: 8, name: 'Haryana', tagline: 'A Pioneer in Highway Tourism', color: 'from-yellow-500 to-orange-600' },
  { id: 9, name: 'Himachal Pradesh', tagline: 'Unforgettable Himachal', color: 'from-slate-300 to-slate-500' },
  { id: 10, name: 'Jharkhand', tagline: 'A New Experience', color: 'from-green-600 to-emerald-800' },
  { id: 11, name: 'Karnataka', tagline: 'One State. Many Worlds.', color: 'from-rose-400 to-pink-600' },
  { id: 12, name: 'Kerala', tagline: "God's Own Country", color: 'from-green-400 to-emerald-600' },
  { id: 13, name: 'Madhya Pradesh', tagline: 'The Heart of Incredible India', color: 'from-orange-400 to-amber-600' },
  { id: 14, name: 'Maharashtra', tagline: 'Unlimited', color: 'from-indigo-400 to-purple-600' },
  { id: 15, name: 'Manipur', tagline: 'Jewel of India', color: 'from-pink-400 to-rose-500' },
  { id: 16, name: 'Meghalaya', tagline: 'Halfway to Heaven', color: 'from-teal-400 to-emerald-600' },
  { id: 17, name: 'Mizoram', tagline: 'Peace Pays', color: 'from-emerald-300 to-teal-500' },
  { id: 18, name: 'Nagaland', tagline: 'Land of Festivals', color: 'from-orange-500 to-red-600' },
  { id: 19, name: 'Odisha', tagline: "India's Best Kept Secret", color: 'from-blue-500 to-indigo-600' },
  { id: 20, name: 'Punjab', tagline: 'India Begins Here', color: 'from-yellow-300 to-amber-500' },
  { id: 21, name: 'Rajasthan', tagline: 'The Land of Kings', color: 'from-orange-400 to-red-500' },
  { id: 22, name: 'Sikkim', tagline: 'Small but Beautiful', color: 'from-green-300 to-emerald-500' },
  { id: 23, name: 'Tamil Nadu', tagline: 'Enchanting Tamil Nadu', color: 'from-yellow-400 to-amber-600' },
  { id: 24, name: 'Telangana', tagline: 'It’s all in it', color: 'from-indigo-300 to-purple-500' },
  { id: 25, name: 'Tripura', tagline: 'Visit Agartala', color: 'from-teal-500 to-green-600' },
  { id: 26, name: 'Uttar Pradesh', tagline: 'Amazing Heritage Grand Experiences', color: 'from-orange-500 to-saffron' },
  { id: 27, name: 'Uttarakhand', tagline: 'Simply Heaven', color: 'from-teal-400 to-emerald-500' },
  { id: 28, name: 'West Bengal', tagline: 'The Sweetest Part of India', color: 'from-rose-500 to-red-600' },
  
  // Union Territories
  { id: 29, name: 'Andaman and Nicobar Islands', tagline: 'Emerald, Blue and You', color: 'from-cyan-400 to-blue-500' },
  { id: 30, name: 'Chandigarh', tagline: 'The City Beautiful', color: 'from-gray-300 to-slate-400' },
  { id: 31, name: 'Dadra and Nagar Haveli and Daman and Diu', tagline: 'The Unexplored Charm', color: 'from-blue-300 to-indigo-400' },
  { id: 32, name: 'Delhi', tagline: 'Dil Walon Ki Dilli', color: 'from-purple-400 to-fuchsia-500' },
  { id: 33, name: 'Jammu and Kashmir', tagline: 'Paradise on Earth', color: 'from-slate-200 to-gray-400' },
  { id: 34, name: 'Ladakh', tagline: 'The Land of High Passes', color: 'from-amber-200 to-orange-300' },
  { id: 35, name: 'Lakshadweep', tagline: 'Coral Paradise', color: 'from-cyan-300 to-teal-400' },
  { id: 36, name: 'Puducherry', tagline: 'Give Time a Break', color: 'from-indigo-400 to-blue-500' }
];

const StateExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredStates = statesData.filter(state => 
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 px-4 relative overflow-hidden">
      {/* Background Blobs Removed for Professional UI */}

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 flex items-center gap-3">
              <MapIcon className="h-10 w-10 text-slate-900" />
              Explore India
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Discover the incredible diversity of India's 28 States and 8 Union Territories. Each destination offers a unique blend of history, culture, and nature.
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search for a state..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white/80 backdrop-blur-sm transition-all"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredStates.map((state, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={state.id}
              onClick={() => navigate(`/explore/${state.name}`)}
              className="group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative aspect-square"
            >
              <img 
                src={stateImages[state.name] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg'} 
                alt={state.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/India_Gate_6607.JPG/800px-India_Gate_6607.JPG';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-3 left-4 md:bottom-4 md:left-5 text-white z-10 pr-4">
                <h3 className="text-lg md:text-xl font-bold tracking-wide drop-shadow-md">{state.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredStates.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No states found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateExplorer;
