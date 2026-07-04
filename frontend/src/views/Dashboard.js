"use client";
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Bell, Bot, PieChart as PieChartIcon } from "lucide-react";
import io from 'socket.io-client';
import axios from 'axios';

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  
  // Mock data for chart
  const mockChartData = [
    { name: "Jan", BTC: 42000, ETH: 2200 },
    { name: "Feb", BTC: 48000, ETH: 2800 },
    { name: "Mar", BTC: 64000, ETH: 3500 },
    { name: "Apr", BTC: 62000, ETH: 3100 },
    { name: "May", BTC: 68000, ETH: 3700 },
    { name: "Jun", BTC: 71000, ETH: 3900 },
  ];

  // Setup WebSocket connection
  useEffect(() => {
    // Connect to Flask SocketIO
    const socket = io("http://localhost:5000");
    
    socket.on('alert', (data) => {
      setAlerts(prev => [data, ...prev].slice(0, 5));
    });
    
    return () => socket.disconnect();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatHistory(prev => [...prev, { role: "user", text: chatInput }]);
    const currentInput = chatInput;
    setChatInput("");
    
    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: currentInput
      });
      
      setChatHistory(prev => [...prev, { role: "agent", text: res.data.response }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: "agent", text: "Error connecting to AI backend." }]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans w-full absolute top-0 left-0 z-50">
      
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
          CRYPTOSE 2.0
        </h1>
        
        <nav className="flex-1 space-y-4">
          <a href="#" className="flex items-center space-x-3 text-blue-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <TrendingUp size={20} />
            <span>Market Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-3 rounded-lg transition-colors">
            <PieChartIcon size={20} />
            <span>Portfolio AI</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Overview</h2>
          
          <div className="relative group">
            <button className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
              <Bell size={20} className="text-slate-300" />
              {alerts.length > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950"></span>
              )}
            </button>
            
            {/* Alerts Dropdown */}
            {alerts.length > 0 && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-xl hidden group-hover:block z-50">
                <div className="p-4 border-b border-slate-700 font-semibold">Live Alerts</div>
                <div className="max-h-64 overflow-y-auto">
                  {alerts.map((a, i) => (
                    <div key={i} className="p-4 border-b border-slate-700/50 hover:bg-slate-700/50">
                      <div className="text-sm font-semibold text-blue-400">{a.title}</div>
                      <div className="text-xs text-slate-300 mt-1">{a.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-medium mb-4">Market Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="BTC" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="ETH" stroke="#3b82f6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-medium mb-2 text-indigo-200">AI Risk Score</h3>
              <p className="text-sm text-indigo-200/70">Based on your mock portfolio (60% BTC, 40% ETH)</p>
            </div>
            <div className="text-6xl font-bold text-center text-white mt-4 mb-4">
              A-
            </div>
            <p className="text-xs text-center text-indigo-300 bg-indigo-950/50 p-2 rounded-lg">
              Low volatility exposure. Consider diversifying into mid-cap alts for higher yield.
            </p>
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center space-x-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Bot className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Agentic AI Assistant</h3>
              <p className="text-xs text-slate-400">Ask about markets, portfolio risk, or crypto concepts.</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <Bot size={48} className="mb-4 opacity-20" />
                <p>Try asking: "What are the technical indicators for BTC today?"</p>
              </div>
            ) : (
              chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask your AI agent..."
                className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-blue-500/20"
              >
                Send
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
