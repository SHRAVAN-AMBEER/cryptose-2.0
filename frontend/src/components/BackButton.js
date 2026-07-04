"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Hide back button if coming from Profile page to Signup
  if (pathname.includes("/signup")) {
    return null; // Don't show the back button
  }

  return (
    <button
      className="fixed top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition"
      onClick={() => router.push(-1)}
    >
      ← Back
    </button>
  );
};

export default BackButton;
