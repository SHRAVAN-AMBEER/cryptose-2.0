"use client";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const CryptoCard = ({ crypto }) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleCoinClick = async () => {
    if (!user) return;

    try {
      await fetch('http://127.0.0.1:5000/track-coin-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: user.email,
          coinId: crypto.id,
          price: crypto.current_price,
          name: crypto.name
        })
      });

      // Navigate to coin details page after tracking
      router.push(`/coin/${crypto.id}`);
    } catch (error) {
      console.error('Failed to track coin view:', error);
    }
  };

  return (
    <div 
      className="bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-700"
      onClick={handleCoinClick}
    >
      <div className="flex items-center gap-4">
        <img src={crypto.image} alt={crypto.name} className="w-10 h-10" />
        <div>
          <h3 className="text-xl font-semibold text-white">{crypto.name}</h3>
          <p className="text-gray-400">{crypto.symbol?.toUpperCase()}</p>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <p className="text-white">
          Price: ${crypto.current_price?.toLocaleString()}
        </p>
        <p className={`${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          24h Change: {crypto.price_change_percentage_24h?.toFixed(2)}%
        </p>
        <p className="text-gray-300">
          Market Cap: ${crypto.market_cap?.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default CryptoCard;
