"use client";
import React from "react";

const Markets = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold">Market Prices</h1>
      <p className="text-lg text-gray-400 mt-2">Live cryptocurrency market data.</p>
      
      <div className="w-full max-w-4xl mt-6">
        <table className="w-full border-collapse bg-gray-800 text-white rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4">Coin</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Change</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-600 hover:bg-gray-700 transition">
              <td className="py-3 px-4">Bitcoin</td>
              <td className="py-3 px-4">$67,000</td>
              <td className="py-3 px-4 text-green-500">+3.2%</td>
            </tr>
            <tr className="border-b border-gray-600 hover:bg-gray-700 transition">
              <td className="py-3 px-4">Ethereum</td>
              <td className="py-3 px-4">$3,200</td>
              <td className="py-3 px-4 text-red-500">-1.5%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Markets;
