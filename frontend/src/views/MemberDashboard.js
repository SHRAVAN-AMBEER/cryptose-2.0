"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import AIChatWidget from "../components/AIChatWidget";


function MemberDashboard() {
  const [coins, setCoins] = useState([]);
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [bestCoin, setBestCoin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/member-market-data", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => setCoins(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error("Error fetching market data:", error);
        setCoins([]);
      });
  }, []);

  const trackCoinView = async (coin) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      await api.post('/track-coin-view', {
        email: user.email,
        coinId: coin.id,
        name: coin.name,
        price: coin.current_price
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Failed to track coin view:', error);
    }
  };

  const handleCheckboxChange = (coinId) => {
    setSelectedCoins((prev) =>
      prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId]
    );
    setBestCoin(null);
    setError(null);
  };

  const handleCompare = () => {
    if (selectedCoins.length >= 2) {
      const selectedCoinData = coins.filter(coin => selectedCoins.includes(coin.id));
      selectedCoinData.forEach(coin => trackCoinView(coin));
      router.push(`/compare-graph?coins=${selectedCoins.join(",")}`);
    } else {
      alert("Please select at least two coins to compare.");
    }
  };

    // AI Assist replaced by Floating RAG Widget

  const handleCoinClick = async (coin) => {
    await trackCoinView(coin);
    router.push(`/coin/${coin.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-[95%] mx-auto dashboard-container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">👑 Member Dashboard</h1>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              🔄 Refresh
            </button>
            <button 
              onClick={handleCompare}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              disabled={selectedCoins.length < 2}
            >
              📊 Compare Selected
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/30 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl shadow-xl overflow-x-auto">
          <table className="dashboard-table">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Select</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Price (USD)</th>
                <th className="py-3 px-4 text-left">Market Cap</th>
                <th className="py-3 px-4 text-left">24h Change</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Volume</th>
                <th className="py-3 px-4 text-left">All-Time High</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => {
                const isTrending = coin.price_change_percentage_24h > 0;
                return (
                  <tr 
                    key={coin.id} 
                    className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors text-black"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedCoins.includes(coin.id)}
                        onChange={() => handleCheckboxChange(coin.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 px-4 cursor-pointer whitespace-nowrap" onClick={() => handleCoinClick(coin)}>
                      <div className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                        <span>{coin.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 cursor-pointer whitespace-nowrap" onClick={() => handleCoinClick(coin)}>
                      ${typeof coin.current_price === 'number' ? coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </td>
                    <td className="py-3 px-4 cursor-pointer whitespace-nowrap" onClick={() => handleCoinClick(coin)}>
                      ${typeof coin.market_cap === 'number' ? coin.market_cap.toLocaleString() : '0'}
                    </td>
                    <td 
                      className={`py-3 px-4 cursor-pointer whitespace-nowrap ${
                        isTrending ? 'text-green-600' : 'text-red-600'
                      }`}
                      onClick={() => handleCoinClick(coin)}
                    >
                      {isTrending ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 cursor-pointer whitespace-nowrap" onClick={() => handleCoinClick(coin)}>
                      {isTrending ? '🔥 Trending' : '📉 Falling'}
                    </td>
                    <td className="py-3 px-4 cursor-pointer whitespace-nowrap" onClick={() => handleCoinClick(coin)}>
                      ${typeof coin.total_volume === 'number' ? coin.total_volume.toLocaleString() : '0'}
                    </td>
                    <td className="py-3 px-4 cursor-pointer whitespace-nowrap" onClick={() => handleCoinClick(coin)}>
                      ${typeof coin.ath === 'number' ? coin.ath.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <AIChatWidget />
    </div>
  );
}
export default MemberDashboard;

