"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from '../context/AuthContext';
import { api, trackCoinView } from '../utils/api';
import axios from 'axios';

function CoinGraph({ coin }) {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [imgData, setImgData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coinData, setCoinData] = useState(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        // Fetch coin graph data
        const graphResponse = await fetch(`http://127.0.0.1:5000/api/coin-history/${id}`);
        const graphData = await graphResponse.json();
        if (graphData.image) setImgData(`data:image/png;base64,${graphData.image}`);
        if (Array.isArray(graphData.history)) setHistory(graphData.history);

        // Fetch current coin data using backend proxy to avoid CORS/rate-limits
        const coinResponse = await fetch(`http://127.0.0.1:5000/api/coin/${id}`);
        const coinData = await coinResponse.json();
        setCoinData(coinData);

        // Track coin view with the new utility function
        if (coinData) {
          await trackCoinView(coinData, 'graph');
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching coin data:", err);
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [id]);

  useEffect(() => {
    const trackCoinView = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;

        await axios.post('http://localhost:5000/track-coin-view', {
          email: userEmail,
          coinId: coin.id,
          price: coin.current_price,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          market_cap: coin.market_cap,
          market_cap_rank: coin.market_cap_rank,
          source: 'graph'
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (error) {
        console.error('Error tracking coin view:', error);
      }
    };

    if (coin) {
      trackCoinView();
    }
  }, [coin]); // Track when coin changes

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        📊 {coinData?.name || id.toUpperCase()} Price Trend
      </h2>

      {loading ? (
        <div className="text-xl text-gray-600 animate-pulse mt-20">Loading graph and data...</div>
      ) : (
        <>
          {imgData && (
            <div className="flex justify-center">
              <img
                src={imgData}
                alt={`${id} price chart`}
                className="w-full max-w-4xl rounded-2xl shadow-lg border border-gray-300"
              />
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">📅 Historical Data</h3>
              <div className="overflow-x-auto">
                <table className="mx-auto w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Price (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((point, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-4 py-2 text-gray-800">{point.date}</td>
                        <td className="px-4 py-2 text-green-600 font-medium">
                          ${parseFloat(point.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <button
        onClick={() => router.back()}
        className="mt-10 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
      >
        ⬅️ Back
      </button>
    </div>
  );
}

export default CoinGraph;