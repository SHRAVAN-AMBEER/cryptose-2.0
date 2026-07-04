"use client";
import React, { useEffect, useState } from 'react';

const CryptoComparator = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [bestCoin, setBestCoin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/crypto');
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptoData();
  }, []);

  const handleSelect = (coin) => {
    setSelectedCoins((prev) => {
      const exists = prev.some((c) => c.id === coin.id);
      if (exists) {
        return prev.filter((c) => c.id !== coin.id);
      } else {
        return [...prev, coin];
      }
    });
    setBestCoin(null); // reset best coin when selection changes
    setError(null);
  };

  const handleAIAssist = async () => {
    setLoading(true);
    setError(null);
    setBestCoin(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coins: selectedCoins.map(c => c.id || c.name) }),
      });
      console.log("AI Assist response status:", response.status);
      const data = await response.json();
      console.log("AI Assist response data:", data);
      if (response.ok) {
        setBestCoin(data.recommendation);
      } else {
        setError(data.error || 'Error from AI Assist');
      }
    } catch (err) {
      console.error("Error during AI Assist fetch:", err);
      setError('Network error during AI Assist');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🔍 Crypto Comparator</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {Array.isArray(cryptoData) && cryptoData.map((coin, index) => (
          <li key={index}>
            <label>
          <input
            type="checkbox"
            onChange={() => handleSelect(coin)}
            checked={selectedCoins.some(c => c.id === coin.id)}
          />
              {' '}
              {coin.name} (${coin.current_price})
            </label>
          </li>
        ))}
      </ul>

      {selectedCoins.length >= 2 && (
        <div>
          <h2>📊 Comparison Table</h2>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Price (USD)</th>
                <th>Market Cap</th>
                <th>24h Change (%)</th>
                <th>Total Volume</th>
                <th>Rank</th>
              </tr>
            </thead>
            <tbody>
              {selectedCoins.map((coin, index) => (
                <tr key={index}>
                  <td>{coin.name}</td>
                  <td>{coin.symbol.toUpperCase()}</td>
                  <td>${coin.current_price.toLocaleString()}</td>
                  <td>${coin.market_cap.toLocaleString()}</td>
                  <td style={{ color: coin.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td>${coin.total_volume.toLocaleString()}</td>
                  <td>{coin.market_cap_rank}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleAIAssist} disabled={loading} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
            {loading ? 'Analyzing...' : 'AI Assist'}
          </button>

          {bestCoin && (
            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e0ffe0', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
              <strong>AI Recommendation:</strong> {bestCoin}
            </div>
          )}

          {error && (
            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '5px', color: 'red' }}>
              Error: {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CryptoComparator;
