import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, GeoJSON, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map as MapIcon, Navigation, X, Info, Loader2, MapPin } from 'lucide-react';

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultCenter = [22.5937, 78.9629];
const indiaBounds = [
  [6.4626, 68.1097], // Southwest coordinates
  [35.5133, 97.3953] // Northeast coordinates
];

const InteractiveMap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showPin = location.state?.showPin;

  const [geoData, setGeoData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [facts, setFacts] = useState('');
  const [loadingFacts, setLoadingFacts] = useState(false);

  useEffect(() => {
    fetch('/india_states.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Error loading geojson:', err));
  }, []);

  const stateStyle = {
    fillColor: '#1e293b', // slate-800, matching the dark theme in the image
    weight: 1,
    opacity: 1,
    color: '#cbd5e1', // slate-300 border
    fillOpacity: 1
  };

  const onEachState = (feature, layer) => {
    const props = feature.properties;
    const stateName = props.NAME_1 || props.name || props.st_nm || props.State_Name || 'Unknown State';
    
    // Bind tooltip for hover effect
    layer.bindTooltip(
      `<div class="font-semibold text-slate-800">${stateName}</div>`, 
      {
        permanent: false,
        direction: "center",
        className: "bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-lg px-3 py-1",
        sticky: true
      }
    );

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: '#6366f1', // indigo-500 hover
          weight: 2,
          color: '#ffffff',
          fillOpacity: 1
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        layer.setStyle(stateStyle);
      },
      click: (e) => {
        setSelectedState(stateName);
        setFacts(''); // reset facts when new state clicked
        
        // Reset style for all and highlight selected
        e.target.setStyle({
          fillColor: '#10b981', // emerald selected
          weight: 2,
          color: '#ffffff'
        });
      }
    });
  };

  const handlePlanTrip = () => {
    navigate('/planner', { state: { prefillDestination: selectedState } });
  };

  const handleQuickFacts = async () => {
    setLoadingFacts(true);
    setFacts('');
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/chat', { 
        query: `Give me 2 very brief, interesting quick facts about the Indian state of ${selectedState}. Format as a short list without intro.` 
      });
      setFacts(res.data.response);
    } catch (err) {
      setFacts('Failed to load facts.');
    }
    setLoadingFacts(false);
  };

  return (
    <div className="h-screen pt-16 bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Map Container */}
      <div className="w-full relative z-0 flex-1 bg-[#f8fafc] flex">
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0f172a 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
        
        {/* Floating Title Overlay */}
        <div className="absolute top-8 left-8 z-[1000] bg-white/90 backdrop-blur-md px-5 py-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
          <div className="bg-slate-900 p-2.5 rounded-xl shadow-inner">
            <MapIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Interactive Map</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5 uppercase tracking-wider">Select a state to explore</p>
          </div>
        </div>

        <MapContainer 
          center={defaultCenter} 
          zoom={4.6} 
          minZoom={4}
          zoomSnap={0.1}
          maxBounds={indiaBounds}
          maxBoundsViscosity={1.0}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          boxZoom={false}
          keyboard={false}
          style={{ height: '100%', width: '100%', zIndex: 0, background: 'transparent' }}
          zoomControl={false}
        >
          {geoData && (
            <GeoJSON 
              data={geoData} 
              style={stateStyle}
              onEachFeature={onEachState}
            />
          )}
          {showPin && (
            <Marker position={[showPin.lat, showPin.lng]}>
              <Popup>
                <div className="font-medium text-gray-900">{showPin.name}</div>
                <div className="text-xs text-gray-500">{showPin.state}</div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Info Panel Overlay */}
        {selectedState && (
          <div className="absolute top-8 right-8 w-80 bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl z-[1000] border border-gray-100 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">{selectedState}</h2>
              <button onClick={() => setSelectedState(null)} className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors shrink-0 border border-gray-100">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 text-[15px] mb-8 leading-relaxed">
              Discover the rich heritage, monuments, and culture of <span className="font-semibold text-slate-800">{selectedState}</span>. Ask the AI guide for personalized itineraries and hidden gems.
            </p>

            <div className="space-y-3">
              <button onClick={handlePlanTrip} className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-200 transition-all">
                Plan Trip to {selectedState}
              </button>
              <button onClick={handleQuickFacts} disabled={loadingFacts} className="w-full py-3.5 bg-white border border-gray-200 text-slate-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                {loadingFacts ? <Loader2 className="h-5 w-5 animate-spin" /> : <Info className="h-5 w-5" />}
                {loadingFacts ? 'Asking AI...' : 'Quick Facts'}
              </button>
              
              {facts && (
                <div className="mt-5 p-5 bg-slate-50/80 rounded-2xl border border-slate-100 text-[14px] text-gray-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {facts}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
