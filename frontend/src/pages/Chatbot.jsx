import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import axios from 'axios';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! I am your personal AI Travel Concierge for India. How may I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Connect to Python AI Service
      const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://127.0.0.1:8000';
      const res = await axios.post(`${AI_API_URL}/api/chat`, { query: userMessage.content });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Apologies, I am currently unable to connect to my network. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 relative flex flex-col items-center justify-center">
      {/* Background Animation */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-50"></div>
        <DotLottieReact
          src="/animations/chatani.lottie"
          loop
          autoplay
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="absolute inset-0 bg-slate-800/10 backdrop-blur-[3px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/10 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-[calc(100vh-7rem)] border border-white/60">
        
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-gray-100 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-sm flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-gray-900 font-semibold text-[17px] tracking-tight leading-tight">AI Travel Assistant</h2>
              <p className="text-[13px] text-gray-500 mt-0.5">Your personal travel companion</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 pt-10 space-y-6 bg-slate-50/30 scroll-smooth">
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] sm:max-w-[75%] p-5 flex gap-4 ${
                msg.role === 'user' 
                ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-200/40 rounded-3xl rounded-tr-sm' 
                : 'bg-white text-gray-700 shadow-lg shadow-gray-200/40 border border-gray-100/80 rounded-3xl rounded-tl-sm'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                )}
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed mt-1">{msg.content}</p>
                {msg.role === 'user' && (
                  <div className="bg-indigo-500 text-white p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center ml-2">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-3xl rounded-tl-sm p-5 shadow-lg shadow-gray-200/40 border border-gray-100/80 flex items-center gap-4">
                <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex gap-1.5 mt-1">
                  <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s' }}></div>
                  <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s', animationDuration: '0.8s' }}></div>
                  <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.8s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white/90 backdrop-blur-xl border-t border-gray-100/80 shrink-0 z-20">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about historical sites, local cuisine, or itinerary planning..."
              className="w-full pl-6 pr-16 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 bg-gray-50/50 hover:bg-white text-gray-800 transition-all duration-300 shadow-inner text-[15px]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full hover:shadow-lg hover:shadow-indigo-300/50 transition-all duration-300 disabled:opacity-40 disabled:hover:shadow-none flex items-center justify-center transform hover:scale-105 active:scale-95"
            >
              <Send className="h-5 w-5 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-[11px] text-gray-400 font-medium">AI can make mistakes. Consider verifying important travel information.</p>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
};

export default Chatbot;
