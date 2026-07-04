"use client";
import React, { useState, useEffect } from 'react';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { FaUser, FaMapMarkerAlt, FaPencilAlt, FaSave, FaSignOutAlt, FaHistory, FaBitcoin, FaRobot, FaSpinner, FaChartLine } from 'react-icons/fa';
import AIInsightCard from '../components/AIInsightCard';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [coinHistory, setCoinHistory] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    bio: '',
    location: '',
    preferences: {}
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profile?email=${user.email}`);
        const data = response.data;
        setProfileData({
          username: data.username || '',
          bio: data.profile?.bio || '',
          location: data.profile?.location || '',
          preferences: data.profile?.preferences || {}
        });
      } catch (error) {
        showMessage('Failed to load profile', 'error');
      }
    };

    const fetchCoinHistory = async () => {
      try {
        const response = await api.get(`/get-coin-history`, {
          params: { email: user.email },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.history) {
          setCoinHistory(response.data.history);
        }
      } catch (error) {
        console.error('Failed to fetch coin history:', error);
      }
    };

    if (user) {
      fetchProfile();
      fetchCoinHistory();
    }
  }, [user]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setIsEditing(false);
        showMessage('Profile updated successfully');
      } else {
        showMessage(result.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
      showMessage('Failed to update profile', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAnalyzePortfolio = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const payload = {
        message: `Please act as a Portfolio Advisor. Review my recently viewed coins (${coinHistory.map(c => c.name).join(', ')}) and my current preferences, and provide a full Portfolio risk analysis.`,
        email: user.email
      };
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        setAiAnalysis(data.message);
      } else {
        showMessage(data.error || 'AI Analysis failed', 'error');
      }
    } catch (err) {
      showMessage('Network error while requesting AI Analysis', 'error');
    }
    setIsAnalyzing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="relative h-40 bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-32 bg-gray-800 rounded-full p-2">
                <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center">
                  <FaUser className="text-4xl text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white">{user.username || user.email}</h1>
              <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full mt-2">
                {user.role}
              </span>
            </div>

            {message.text && (
              <div className={`text-center p-3 rounded mb-4 ${
                message.type === 'error' ? 'bg-red-600' : 'bg-green-600'
              } text-white`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-400">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-400">Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                {isEditing ? (
                  <button
                    type="submit"
                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaSave className="mr-2" />
                    Save Changes
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <FaPencilAlt className="mr-2" />
                    Edit Profile
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            </form>

            {/* AI Portfolio Analysis Section */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FaRobot className="mr-2 text-emerald-400" />
                  AI Portfolio Insights
                </h2>
                <button
                  onClick={handleAnalyzePortfolio}
                  disabled={isAnalyzing}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 shadow-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FaChartLine className="mr-2" />
                      Analyze Portfolio with AI
                    </>
                  )}
                </button>
              </div>
              
              {aiAnalysis && <AIInsightCard rawMarkdown={aiAnalysis} />}
              {!aiAnalysis && !isAnalyzing && (
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center text-gray-400">
                  Click the button above to generate a personalized risk and allocation report based on your history.
                </div>
              )}
            </div>

            {/* Coin History Section */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center mb-4">
                <FaHistory className="mr-2" />
                Recently Viewed Coins
              </h2>
              {coinHistory.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coinHistory.map((coin, index) => (
                    <Link
                      key={`${coin.coinId}-${index}`}
                      href={`/coin/${coin.coinId}`}
                      className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center">
                        <FaBitcoin className="text-yellow-500 mr-3 text-xl" />
                        <div>
                          <h3 className="text-white font-medium">{coin.name}</h3>
                          <p className="text-gray-400 text-sm">
                            Price: ${coin.price?.toLocaleString() || 'N/A'}
                          </p>
                          <p className="text-gray-400 text-xs">
                            Viewed: {new Date(coin.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center">No coins viewed yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
