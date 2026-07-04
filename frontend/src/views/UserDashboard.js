"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


function UserDashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true); // Set loading before fetch
      const res = await fetch("http://127.0.0.1:5000/api/market-data", {
        cache: "no-store",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCoins(data);
      } else {
        console.error("Invalid data format:", data);
        setCoins([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setCoins([]);
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  useEffect(() => {
    fetchData(); // On first mount
    const handleFocus = () => fetchData(); // Re-fetch when user returns to tab
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleUpgrade = () => setShowModal(true);
  const confirmUpgrade = () => router.push("/signup/member");

  const handleRowClick = (coinId) => {
    router.push(`/coin/${coinId}`);
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h2>📈 Trending Cryptocurrencies</h2>
        <div className="actions">
          <button className="refresh-btn" onClick={fetchData}>
            🔄 Refresh
          </button>
          <button className="premium-btn" onClick={handleUpgrade}>
            🚀 Get Premium
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", fontSize: "18px" }}>
          ⏳ Loading market data...
        </div>
      ) : coins.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", fontSize: "18px", color: "gray" }}>
          ❌ No market data available. Please try refreshing.
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Price (USD)</th>
              <th>Market Cap</th>
              <th>Change (24h)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              const isTrending = coin.price_change_percentage_24h > 0;
              return (
                <tr
                  key={coin.id}
                  onClick={() => handleRowClick(coin.id)}
                  className="clickable-row"
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <img
                      src={coin.image}
                      alt={coin.name}
                      style={{ width: "32px", height: "32px" }}
                    />
                  </td>
                  <td>{coin.name}</td>
                  <td>${coin.current_price.toLocaleString()}</td>
                  <td>${coin.market_cap.toLocaleString()}</td>
                  <td
                    style={{
                      color: isTrending ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {isTrending ? "▲" : "▼"} {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td>{isTrending ? "🔥 Trending" : "📉 Falling"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Upgrade to Member?</h3>
            <p>Get exclusive premium features by becoming a Member!</p>
            <div className="modal-actions">
              <button onClick={confirmUpgrade} className="modal-confirm">
                Yes, Sign Me Up!
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="modal-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
