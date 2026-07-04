"use client";
import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaSignOutAlt, FaChartLine, FaHome, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
    setProfileOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role?.toLowerCase()) {
      case 'admin':
        return '/AdminDashboard';
      case 'member':
        return '/MemberDashboard';
      default:
        return '/UserDashboard';
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side - Logo & Navigation */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-2xl font-bold hover:text-blue-400 transition">
            CRYPTOSE
          </Link>
          <Link href="/" className="flex items-center hover:text-blue-400 transition">
            <FaHome className="mr-1" /> Home
          </Link>
          <Link href="/markets" className="flex items-center hover:text-blue-400 transition">
            <FaChartLine className="mr-1" /> Markets
          </Link>
        </div>

        {/* Right Side - Profile & Auth */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
              >
                <FaUserCircle className="mr-2" />
                {user.username || user.email}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <Link
                    href={getDashboardLink()}
                    className="block px-4 py-2 text-sm hover:bg-gray-700 transition flex items-center"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FaChartLine className="mr-2" /> Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-700 transition flex items-center"
                    onClick={() => setProfileOpen(false)}
                  >
                    <FaUser className="mr-2" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
