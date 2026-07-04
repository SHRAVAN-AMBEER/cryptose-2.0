"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaChevronDown, FaPaperPlane, FaUserTie, FaGraduationCap, FaChartLine } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I am your Crypto AI Assistant. I can search our knowledge base, analyze markets, or review your portfolio. How can I help you today?',
      telemetry: null
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const email = JSON.parse(localStorage.getItem('user'))?.email || 'guest@example.com';
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: userMsg, email })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message,
          telemetry: data.telemetry
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error || 'Failed to get response'}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }]);
    }
    
    setIsLoading(false);
  };

  const renderAgentBadge = (telemetry) => {
    if (!telemetry || !telemetry.selected_agent) return null;
    const agent = telemetry.selected_agent;
    
    let Icon = FaRobot;
    let label = "AI Assistant";
    let colorClass = "bg-blue-600";

    if (agent === "analyst") {
      Icon = FaChartLine;
      label = "Crypto Analyst";
      colorClass = "bg-purple-600";
    } else if (agent === "advisor") {
      Icon = FaUserTie;
      label = "Portfolio Advisor";
      colorClass = "bg-emerald-600";
    } else if (agent === "education") {
      Icon = FaGraduationCap;
      label = "Education Agent";
      colorClass = "bg-indigo-600";
    }

    return (
      <div className={`flex items-center space-x-1 ${colorClass} text-white text-xs px-2 py-1 rounded-full mb-2 inline-flex shadow-sm`}>
        <Icon size={10} />
        <span className="font-semibold">{label}</span>
      </div>
    );
  };

  const renderTelemetryPill = (telemetry) => {
    if (!telemetry) return null;
    return (
      <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-gray-400">
        <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">
          ⏱️ {(telemetry.latency_ms / 1000).toFixed(2)}s
        </span>
        {telemetry.tool_calls && telemetry.tool_calls.length > 0 && (
          <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">
            🛠️ {telemetry.tool_calls.length} Tools Used
          </span>
        )}
        {telemetry.status === "security_blocked" && (
          <span className="bg-red-900/50 text-red-400 px-2 py-1 rounded border border-red-700">
            🛡️ Guardrail Triggered
          </span>
        )}
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all z-50 flex items-center justify-center animate-bounce hover:animate-none"
      >
        <FaRobot size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[650px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center space-x-2">
          <FaRobot size={20} />
          <h3 className="font-bold">Crypto AI Assistant</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:text-gray-300 transition-colors">
          <FaChevronDown size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] flex flex-col">
              {msg.role === 'assistant' && renderAgentBadge(msg.telemetry)}
              <div 
                className={`p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700 shadow-md'
                }`}
              >
                <div className={`text-sm ${msg.role === 'assistant' ? 'prose prose-invert max-w-none' : 'whitespace-pre-wrap'}`}>
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown>{typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content, null, 2)}</ReactMarkdown>
                  ) : (
                    typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
                  )}
                </div>
              </div>
              {msg.role === 'assistant' && renderTelemetryPill(msg.telemetry)}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 p-4 rounded-2xl rounded-bl-none border border-gray-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-900 border-t border-gray-800 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about crypto, technicals, or your portfolio..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 shadow-inner"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md"
        >
          <FaPaperPlane size={14} />
        </button>
      </form>
    </div>
  );
}
