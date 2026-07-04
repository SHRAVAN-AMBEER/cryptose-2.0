"use client";
  import { useEffect } from 'react';
  import { FaArrowLeft, FaArrowRight, FaCrown, FaUsers, FaUserTie } from 'react-icons/fa';
  

  const SignUpPage = () => {
    useEffect(() => {
      // Add ripple effect to buttons
      const buttons = document.querySelectorAll('.btn-hover-effect');
      
      const handleClick = (e) => {
        e.preventDefault();
        
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const button = e.currentTarget;
        ripple.style.width = ripple.style.height = Math.max(button.offsetWidth, button.offsetHeight) + 'px';
        ripple.style.left = (e.offsetX - button.offsetWidth) + 'px';
        ripple.style.top = (e.offsetY - button.offsetHeight) + 'px';
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
          ripple.remove();
        }, 600);
        
        // Navigate after a short delay for better UX
        const href = button.getAttribute('data-href');
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      };

      buttons.forEach(button => {
        button.addEventListener('click', handleClick);
      });

      return () => {
        buttons.forEach(button => {
          button.removeEventListener('click', handleClick);
        });
      };
    }, []);

    return (
      <>
        
        
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
          <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
            {/* Back Button */}
            <button 
              onClick={() => window.history.back()} 
              className="absolute top-6 left-6 md:top-8 md:left-8 group"
            >
              <div className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <FaArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
                <span className="hidden md:inline">Back</span>
              </div>
            </button>

            {/* Signup Heading */}
            <div className="text-center mb-12">
              <h1 
                className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text" 
                style={{ backgroundImage: 'linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)' }}
              >
                Join Our Community
              </h1>
              <p className="text-gray-300 max-w-md mx-auto">
                Choose your account type to get started with our amazing platform
              </p>
            </div>

            {/* Signup Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              {/* Member Card */}
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 h-full flex flex-col items-center text-center">
                  <div 
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 float-animation" 
                    style={{ animationDelay: '0.2s' }}
                  >
                    <FaUsers className="text-3xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Member</h3>
                  <p className="text-gray-300 mb-6">Collaborate with teams and access member features</p>
                  <button 
                    data-href="/signup/member"
                    className="btn-hover-effect px-6 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white font-medium mt-auto"
                  >
                    Sign Up <FaArrowRight className="ml-2 inline" />
                  </button>
                </div>
              </div>

              {/* User Card */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 h-full flex flex-col items-center text-center">
                  <div 
                    className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mb-4 float-animation" 
                    style={{ animationDelay: '0.4s' }}
                  >
                    <FaUserTie className="text-3xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">User</h3>
                  <p className="text-gray-300 mb-6">Standard access to all basic platform features</p>
                  <button 
                    data-href="/signup/user"
                    className="btn-hover-effect px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium mt-auto"
                  >
                    Sign Up <FaArrowRight className="ml-2 inline" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-12 text-center text-gray-400 text-sm">
              <p>Already have an account? <a href="/login" className="text-blue-400 hover:text-blue-300 underline">Sign in here</a></p>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
          .btn-hover-effect {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
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
          .gradient-text {
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
          }
          .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
          }
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}</style>
      </>
    );
  };

  export default SignUpPage;