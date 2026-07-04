"use client";
import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

import { useRouter } from "next/navigation";
import { useAuth } from '../context/AuthContext';

const MemberSignup = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
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
      showMessage('Please fill all fields!', true);
      return;
    }
    
    try {
      const result = await register({ username, email, password }, 'member');
      
      if (result.success) {
        showMessage('Member registered successfully!');
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
      
      
      <div className="min-h-screen flex items-center justify-center p-4 font-['Poppins']" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="w-full max-w-md animate__animated animate__fadeIn">
          <div className="form-container bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-700 transform transition-all duration-500 hover:shadow-2xl">
            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center mb-4 floating">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500 animate__animated animate__fadeInDown">
                  Member Signup
                </h2>
                <p className="text-gray-400 animate__animated animate__fadeIn animate__delay-1s">Join our community today</p>
              </div>

              {message && (
                <div className={`mb-4 p-3 rounded text-white text-center ${isError ? 'bg-red-600' : 'bg-green-600'}`}>
                  {message}
                </div>
              )}
              
              <form id="signupForm" className="space-y-5" onSubmit={handleSubmit}>
                <div className="animate__animated animate__fadeInLeft animate__delay-1s">
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 input-field hover:border-teal-500 transition-all duration-300">
                    <FaUser className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Full Name"
                      className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="animate__animated animate__fadeInLeft animate__delay-1s">
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 input-field hover:border-teal-500 transition-all duration-300">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email Address"
                      className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="animate__animated animate__fadeInLeft animate__delay-1s">
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 input-field hover:border-teal-500 transition-all duration-300">
                    <FaLock className="h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-teal-500 focus:outline-none"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <div className="animate__animated animate__fadeInUp animate__delay-2s">
                  <button
                    type="submit"
                    className="btn-hover-effect w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg pulse"
                  >
                    <span className="flex items-center justify-center">
                      <FaArrowRight className="h-5 w-5 mr-2" />
                      Create Account
                    </span>
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-6 animate__animated animate__fadeIn animate__delay-2s">
                <p className="text-gray-400">
                  Already have an account? 
                  <a href="/login" onClick={handleSignInClick} className="text-teal-400 hover:text-teal-300 transition-colors ml-1">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-gray-500 text-sm animate__animated animate__fadeIn animate__delay-3s">
            <p>By signing up, you agree to our Terms and Privacy Policy</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .pulse {
          animation: pulse 2s infinite;
        }
        
        .input-field {
          transition: all 0.3s ease;
        }
        
        .input-field:focus-within {
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
        }
        
        .btn-hover-effect {
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .btn-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }
        
        .btn-hover-effect:active {
          transform: translateY(0);
        }
        
        .btn-hover-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.1);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        
        .btn-hover-effect:hover::after {
          transform: translateX(0);
        }
      `}</style>
    </>
  );
};

export default MemberSignup;