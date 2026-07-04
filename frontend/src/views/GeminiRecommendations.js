"use client";
import React from 'react';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaRobot, FaChartLine, FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import { trackCompareCoins } from '../utils/api';

const GeminiRecommendations = ({ coins }) => {
  const [locationState, setLocationState] = useState({});
  useEffect(() => {
    const saved = sessionStorage.getItem('ai_recommendation_state');
    if (saved) setLocationState(JSON.parse(saved));
  }, []);
  const router = useRouter();
  const { selectedCoins, bestCoin } = locationState;

  const formatRecommendation = (text) => {
    if (!text) return [];

    // First clean up the text
    const cleanText = text
      .replace(/\*/g, '') // Remove asterisks
      .replace(/\.(\S)/g, '. $1') // Add space after periods if missing
      .replace(/,(\S)/g, ', $1') // Add space after commas if missing
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    // Split text into sections based on common patterns
    const sections = cleanText
      .split(/(?:Summary:|Analysis:|Recommendation:|Conclusion:)/)
      .filter(section => section.trim().length > 0)
      .map(section => {
        // Split section into paragraphs and clean them
        return section
          .split(/\n+/)
          .filter(para => para.trim().length > 0)
          .map(para => {
            // Format list items if they exist
            if (para.includes('- ')) {
              return {
                type: 'list',
                items: para.split('- ').filter(item => item.trim().length > 0)
              };
            }
            return {
              type: 'paragraph',
              content: para.trim()
            };
          });
      });

    return sections;
  };

  if (!selectedCoins || !bestCoin) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">No recommendation data available</h2>
          <button
            onClick={() => router.push('/MemberDashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaArrowLeft className="inline mr-2" /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleAIAssist = async () => {
    if (selectedCoins.length < 2) {
      setError("Please select at least two coins for AI assistance");
      return;
    }
    setLoading(true);
    setError(null);
    setBestCoin(null);
    
    try {
      // Track the coins being analyzed
      const selectedCoinData = coins.filter(coin => 
        selectedCoins.includes(coin.id)
      );
      await trackCompareCoins(selectedCoinData);

      // Existing AI assist logic
      const response = await fetch('http://127.0.0.1:5000/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coins: selectedCoins }),
      });
      
      // ...rest of existing code...
    } catch (error) {
      // ...existing error handling...
    }
  };

  const formattedSections = formatRecommendation(bestCoin);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <FaRobot className="inline-block mr-3 text-blue-400" />
            AI Analysis Results
          </h1>
          <p className="text-gray-400">
            Powered by AI
          </p>
        </div>

        {/* Best Coin Recommendation */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-8 flex items-center">
            <FaCheckCircle className="text-green-500 mr-3" />
            Investment Analysis
          </h2>
          
          <div className="prose prose-invert max-w-none space-y-8">
            {formattedSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                {section.map((block, blockIndex) => (
                  <div key={blockIndex}>
                    {block.type === 'paragraph' ? (
                      <p className="text-gray-300 leading-relaxed">
                        {block.content}
                      </p>
                    ) : (
                      <ul className="space-y-2 mt-4 ml-4">
                        {block.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start text-gray-300">
                            <FaChevronRight className="text-blue-400 mt-1 mr-2 flex-shrink-0" />
                            <span className="leading-relaxed">{item.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Analyzed Coins */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FaChartLine className="text-blue-400 mr-3" />
            Analyzed Coins
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCoins.map((coin) => (
              <div
                key={coin.id}
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition cursor-pointer"
                onClick={() => router.push(`/coin/${coin.id}`)}
              >
                <div className="flex items-center space-x-3">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <h3 className="font-semibold">{coin.name}</h3>
                    <p className="text-sm text-gray-400">
                      ${coin.current_price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/MemberDashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiRecommendations;