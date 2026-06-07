import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedCars from "../components/FeaturedCars";
import CarGallery from "../components/CarGallery";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Home | Car Bazaar",
  description: "Browse premium vehicles from trusted sellers in Kenya.",
};

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedCars />
      <CarGallery />
      <Footer />
    </div>
  );
}

