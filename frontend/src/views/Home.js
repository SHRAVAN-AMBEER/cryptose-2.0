"use client";
import { useEffect } from 'react';


export default function CryptoseLanding() {
  useEffect(() => {
    // Add interactive cursor effects
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        const icon = this.querySelector('i');
        if (icon) icon.classList.add('fa-bounce');
      });
      
      button.addEventListener('mouseleave', function() {
        const icon = this.querySelector('i');
        if (icon) icon.classList.remove('fa-bounce');
      });
    });

    // Add scroll animation for cards
    const cards = document.querySelectorAll('.card-hover');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = `all 0.5s ease ${index * 0.1}s`;
      observer.observe(card);
    });

    return () => {
      // Cleanup observers
      cards.forEach(card => observer.unobserve(card));
    };
  }, []);

  return (
    <>
      
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 overflow-x-hidden">
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          .card-hover {
            transition: all 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          }
          .button-hover {
            transition: all 0.3s ease;
          }
          .button-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          }
          .gradient-text {
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
        `}</style>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-blue-500 opacity-20 blur-xl float-animation" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-1/3 right-20 w-24 h-24 rounded-full bg-purple-500 opacity-20 blur-xl float-animation" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-20 h-20 rounded-full bg-indigo-500 opacity-20 blur-xl float-animation" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text pulse-animation">
            Your AI-Powered Cryptocurrency Tracking Platform
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Track crypto trends with smart insights. <i className="fas fa-chart-line ml-2 text-blue-400"></i>
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition button-hover shadow-lg flex items-center justify-center"
              onClick={() => window.location.href = '/signup'}
            >
              Get Started <i className="fas fa-rocket ml-2"></i>
            </button>
            <button 
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition button-hover shadow-lg flex items-center justify-center"
              onClick={() => window.location.href = '/markets'}
            >
              Market Prices <i className="fas fa-coins ml-2"></i>
            </button>
          </div>

          <section className="mt-12 w-full">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 gradient-text">
              Why Choose CRYPTOSE? <i className="fas fa-star text-yellow-400 ml-2"></i>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl card-hover border border-gray-700">
                <div className="text-blue-400 text-4xl mb-4">
                  <i className="fas fa-bolt"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-Time Crypto Tracking</h3>
                <p className="text-gray-400">Get up-to-date market insights on all major cryptocurrencies.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl card-hover border border-gray-700">
                <div className="text-purple-400 text-4xl mb-4">
                  <i className="fas fa-brain"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
                <p className="text-gray-400">Predict market trends with AI-driven insights.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl card-hover border border-gray-700">
                <div className="text-green-400 text-4xl mb-4">
                  <i className="fas fa-list-check"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Customizable Watchlists</h3>
                <p className="text-gray-400">Track the coins that matter most to you.</p>
              </div>
            </div>
          </section>

          <div className="mt-16 text-gray-500 text-sm">
            <p>Join thousands of investors making smarter crypto decisions</p>
            <div className="flex justify-center space-x-4 mt-4">
              <i className="fab fa-bitcoin text-yellow-500 text-xl"></i>
              <i className="fab fa-ethereum text-purple-500 text-xl"></i>
              <i className="fas fa-chart-pie text-blue-500 text-xl"></i>
              <i className="fas fa-wallet text-green-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}