"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const showMessage = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      showMessage('Please enter your email address', true);
      return;
    }
    setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      showMessage('Please enter a new password', true);
      return;
    }

    try {
      const result = await forgotPassword(email, newPassword);
      if (result.success) {
        showMessage('Password reset successful!');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        showMessage(result.error || 'Password reset failed', true);
      }
    } catch (error) {
      showMessage('Password reset failed. Please try again.', true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-['Poppins']" 
         style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="w-full max-w-md">
        <div className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Reset Password
          </h2>

          {message && (
            <div className={`mb-4 p-3 rounded text-white text-center ${isError ? 'bg-red-600' : 'bg-green-600'}`}>
              {message}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSubmitEmail} className="space-y-6">
              <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 hover:border-blue-500 transition duration-300">
                <FaEnvelope className="text-gray-400 mr-3" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 flex items-center justify-center"
              >
                <FaArrowRight className="mr-2" /> Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 hover:border-blue-500 transition duration-300">
                <FaLock className="text-gray-400 mr-3" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 flex items-center justify-center"
              >
                <FaArrowRight className="mr-2" /> Reset Password
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;