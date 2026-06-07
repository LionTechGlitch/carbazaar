"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery.trim())}` : "";
    router.push(`/home${params}#inventory`);
    setTimeout(() => document.getElementById("inventory")?.scrollIntoView({ behavior: "smooth" }), 200);
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-kairo-deep/90 via-kairo-bg/80 to-kairo-deep/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          Find Your Perfect
          <br />
          <span className="text-kairo-gold">Dream Car</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
          Discover premium vehicles from trusted sellers. Your next adventure starts here.
        </p>

        {/* Search CTA */}
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20">
            <input
              type="text"
              placeholder="Search by make, model, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-4 rounded-md bg-white/5 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-8 py-4 bg-kairo-gold text-kairo-deep font-semibold rounded-md hover:bg-kairo-gold-hover transition-colors whitespace-nowrap"
            >
              Search Inventory
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}





