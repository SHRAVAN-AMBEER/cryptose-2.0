"use client";
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaTimes, FaExclamationTriangle, FaChartLine, FaInfoCircle } from 'react-icons/fa';
import useAlertStore from '../context/useAlertStore';

export default function AlertCenter() {
  const { alerts, addAlert, markAlertOld, removeAlert, sidebarOpen, setSidebarOpen, clearAll } = useAlertStore();

  useEffect(() => {
    // Connect to backend Socket.IO
    const socket = io('http://127.0.0.1:5000');

    socket.on('alert', (data) => {
      addAlert(data);
    });

    return () => socket.disconnect();
  }, [addAlert]);

  // Auto-dismiss toasts after 5 seconds
  useEffect(() => {
    const newAlerts = alerts.filter(a => a.isNew);
    newAlerts.forEach(alert => {
      setTimeout(() => {
        markAlertOld(alert.id);
      }, 5000);
    });
  }, [alerts, markAlertOld]);

  const activeToasts = alerts.filter(a => a.isNew).slice(0, 3); // max 3 toasts

  const getIcon = (type, title) => {
    const text = (type + " " + title).toLowerCase();
    if (text.includes('breakout') || text.includes('price')) return <FaChartLine className="text-green-400" />;
    if (text.includes('whale') || text.includes('risk')) return <FaExclamationTriangle className="text-yellow-400" />;
    return <FaInfoCircle className="text-blue-400" />;
  };

  return (
    <>
      {/* Toast Notification Container (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col space-y-3 pointer-events-none">
        <AnimatePresence>
          {activeToasts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 w-80 pointer-events-auto flex items-start space-x-3"
            >
              <div className="mt-1">{getIcon(alert.type, alert.title)}</div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">{alert.title}</h4>
                <p className="text-gray-400 text-xs mt-1">{alert.message}</p>
              </div>
              <button 
                onClick={() => markAlertOld(alert.id)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <FaTimes size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Bell Button for Sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-24 right-6 bg-gray-800 border border-gray-700 text-gray-300 p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all z-40"
      >
        <FaBell size={20} />
        {alerts.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
            {alerts.length}
          </span>
        )}
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800">
              <div className="flex items-center space-x-2 text-white font-bold">
                <FaBell />
                <span>Alert History</span>
              </div>
              <div className="flex space-x-3">
                <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300">Clear</button>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {alerts.length === 0 ? (
                <div className="text-gray-500 text-center mt-10 text-sm">No alerts yet.</div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="bg-gray-800 border border-gray-700 rounded p-3 flex items-start space-x-3 relative group">
                    <div className="mt-1">{getIcon(alert.type, alert.title)}</div>
                    <div className="flex-1">
                      <h5 className="text-gray-200 text-sm font-semibold">{alert.title}</h5>
                      <p className="text-gray-400 text-xs mt-1">{alert.message}</p>
                      <span className="text-[10px] text-gray-500 mt-2 block">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <button 
                      onClick={() => removeAlert(alert.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
