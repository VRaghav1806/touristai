import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Home = () => {
  const handleAnimationComplete = () => {
    // Current component only uses 1 animation now
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <DotLottieReact
          src="/animations/icelands.lottie"
          loop
          autoplay
          className="absolute inset-0 w-full h-full opacity-40 scale-125 object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-slate-900/60 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-saffron"></span>
          </span>
          <span className="text-sm font-medium">Meet your intelligent travel companion for India</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6"
        >
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron via-white to-green">India</span>
          <br/>Like Never Before
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-12"
        >
          Real-time guidance, personalized itineraries, cultural insights, and route optimization—powered by advanced AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/chat" className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <Bot className="h-6 w-6 text-slate-900" />
            Talk to AI Guide
          </Link>
          <Link to="/planner" className="px-8 py-4 glass text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6" />
            Plan Your Trip
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
