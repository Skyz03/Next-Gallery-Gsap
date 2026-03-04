"use client"; // We need this for state and useEffect

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Navigation from "./components/Navigation";
import GSAPWrapper from "./components/providers/GSAPWrapper";
import Preloader from "./components/Preloader";
import { AnimatePresence } from "framer-motion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: Metadata cannot be exported from a 'use client' file.
// If you need SEO, keep metadata in a separate 'page.tsx' or a 'parent layout'.
// For now, we focus on the logic.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user has already seen the intro this session
    const hasVisited = sessionStorage.getItem("visited");
    if (hasVisited) {
      setLoading(false);
    }
  }, []);

  const handleComplete = () => {
    setLoading(false);
    sessionStorage.setItem("visited", "true");
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* AnimatePresence handles the smooth exit of the Preloader */}
        <AnimatePresence mode="wait">
          {loading && <Preloader key="preloader" onComplete={handleComplete} />}
        </AnimatePresence>

        <SmoothScroll>
          <GSAPWrapper>
            {/* We only show the main content once loading is false */}
            {!loading && (
              <>
                <Navigation />
                <main>{children}</main>
              </>
            )}
          </GSAPWrapper>
        </SmoothScroll>
      </body>
    </html>
  );
}