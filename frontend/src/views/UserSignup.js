"use client";
import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

import { useRouter } from "next/navigation";
import { useAuth } from '../context/AuthContext';

const UserSignup = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const showMessage = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    if (!username || !email || !password) {
      showMessage('All fields are required!', true);
      return;
    }

    try {
      const result = await register({ username, email, password }, 'user');
      
      if (result.success) {
        showMessage('User registered successfully!');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        showMessage(result.error || 'Registration failed. Please try again.', true);
        if (result.error?.includes('already exists')) {
          setTimeout(() => router.push('/login'), 2000);
        }
      }
    } catch (error) {
      showMessage('Registration failed. Please try again.', true);
    }
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <>
      

      <div className="min-h-screen flex items-center justify-center font-['Poppins'] p-4" style={{ background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' }}>
        <div className="w-full max-w-md animate__animated animate__fadeIn">
          <div className="form-container bg-gray-900 bg-opacity-90 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl transition duration-300 hover:shadow-teal-500/20">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center floating">
                <FaUser className="text-white text-3xl" />
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mt-4 animate__animated animate__fadeInDown">
                User Signup
              </h2>
              <p className="text-gray-400 animate__animated animate__fadeIn animate__delay-1s">Create your new account</p>
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded text-white text-center ${isError ? 'bg-red-600' : 'bg-green-600'}`}>
                {message}
              </div>
            )}

            <form id="signupForm" className="space-y-5" onSubmit={handleSubmit}>
              <div className="flex items-center bg-gray-800 rounded-lg px-4 border border-gray-700 hover:border-indigo-500 transition duration-300">
                <FaUser className="text-gray-400 mr-3" />
                <input type="text" id="username" name="username" placeholder="Full Name" className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none" />
              </div>

              <div className="flex items-center bg-gray-800 rounded-lg px-4 border border-gray-700 hover:border-indigo-500 transition duration-300">
                <FaEnvelope className="text-gray-400 mr-3" />
                <input type="email" id="email" name="email" placeholder="Email Address" className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none" />
              </div>

              <div className="flex items-center bg-gray-800 rounded-lg px-4 border border-gray-700 hover:border-indigo-500 transition duration-300">
                <FaLock className="text-gray-400 mr-3" />
                <input type="password" id="password" name="password" placeholder="Password" className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none" />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                <FaArrowRight />
                Create Account
              </button>

              <div className="text-center text-sm text-gray-400">
                Already a user?
                <a href="/login" onClick={handleSignInClick} className="text-blue-400 hover:underline ml-1">Sign In</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
};

export default UserSignup;
