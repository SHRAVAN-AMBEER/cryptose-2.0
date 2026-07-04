"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

export default function AIInsightCard({ rawMarkdown }) {
  if (!rawMarkdown) return null;
  const markdownText = typeof rawMarkdown === 'string' ? rawMarkdown : JSON.stringify(rawMarkdown, null, 2);

  // Attempt to parse out the 3 sections from Explainable AI format:
  // 1. **Recommendation / Conclusion**: ...
  // 2. **Supporting Evidence**: ...
  // 3. **Risk / Caveats**: ...
  
  const parseSection = (marker1, marker2) => {
    const idx1 = markdownText.indexOf(marker1);
    if (idx1 === -1) return null;
    let idx2 = marker2 ? markdownText.indexOf(marker2) : markdownText.length;
    if (idx2 === -1) idx2 = markdownText.length;
    
    // Extracted content (removing the header line itself)
    const content = markdownText.substring(idx1, idx2).trim();
    return content.split('\n').slice(1).join('\n').trim();
  };

  const recHeader = "1. **Recommendation";
  const evHeader = "2. **Supporting";
  const riskHeader = "3. **Risk";

  const recommendation = parseSection(recHeader, evHeader);
  const evidence = parseSection(evHeader, riskHeader);
  const risks = parseSection(riskHeader, null);

  // If we couldn't parse the exact Explainable AI format, just render it all as markdown
  if (!recommendation && !evidence && !risks) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl prose prose-invert max-w-none">
        <ReactMarkdown>{markdownText}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden mt-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 border-b border-gray-700">
        <h3 className="text-white font-bold flex items-center space-x-2">
          <FaCheckCircle />
          <span>AI Portfolio Recommendation</span>
        </h3>
      </div>
      
      <div className="p-6 space-y-6">
        {recommendation && (
          <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-emerald-500">
            <h4 className="text-emerald-400 font-semibold mb-2">Conclusion</h4>
            <div className="text-gray-200 text-sm prose prose-invert">
              <ReactMarkdown>{recommendation}</ReactMarkdown>
            </div>
          </div>
        )}

        {evidence && (
          <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="text-blue-400 font-semibold flex items-center space-x-2 mb-2">
              <FaInfoCircle />
              <span>Supporting Evidence</span>
            </h4>
            <div className="text-gray-300 text-sm prose prose-invert">
              <ReactMarkdown>{evidence}</ReactMarkdown>
            </div>
          </div>
        )}

        {risks && (
          <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-red-500">
            <h4 className="text-red-400 font-semibold flex items-center space-x-2 mb-2">
              <FaExclamationTriangle />
              <span>Risks & Caveats</span>
            </h4>
            <div className="text-gray-300 text-sm prose prose-invert">
              <ReactMarkdown>{risks}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
