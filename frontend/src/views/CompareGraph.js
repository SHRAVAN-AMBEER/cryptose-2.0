"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackCompareCoins } from '../utils/api';

function CompareGraph() {
  const [imageSrc, setImageSrc] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams;
    const coinIds = params.get("coins");

    if (coinIds) {
      // First fetch coin data to get full details
      const fetchCoinsAndTrack = async () => {
        try {
          const coinPromises = coinIds.split(',').map(id => 
            fetch(`https://api.coingecko.com/api/v3/coins/${id}`).then(res => res.json())
          );
          const coinsData = await Promise.all(coinPromises);
          
          // Track the comparison
          await trackCompareCoins(coinsData);
          
          // Fetch and display the comparison graph
          const graphRes = await fetch(`http://127.0.0.1:5000/api/compare?coins=${coinIds}`);
          const graphData = await graphRes.json();
          if (graphData.image) {
            setImageSrc(`data:image/png;base64,${graphData.image}`);
          } else {
            console.error("No image returned.");
          }
        } catch (err) {
          console.error("Error in comparison process:", err);
        }
      };

      fetchCoinsAndTrack();
    }
  }, [searchParams.toString()]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">📊 Comparison Chart</h1>
      {imageSrc ? (
        <img src={imageSrc} alt="Comparison Graph" className="rounded-lg shadow-lg max-w-full" />
      ) : (
        <p className="text-gray-400">Loading graph...</p>
      )}
    </div>
  );
}

export default CompareGraph;