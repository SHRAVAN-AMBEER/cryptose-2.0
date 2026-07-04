import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRYPTOSE 2.0",
  description: "Agentic AI-Powered Cryptocurrency Intelligence Platform",
};

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import AlertCenter from "@/components/AlertCenter";
import "@/views/Dashboard.css";
import "@/views/UserDashboard.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          <AlertCenter />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
