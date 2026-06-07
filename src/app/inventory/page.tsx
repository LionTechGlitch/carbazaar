import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import CarGallery from "../components/CarGallery";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Inventory | Car Bazaar",
  description: "Search and filter available cars in Car Bazaar inventory.",
};

export default function InventoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InventoryContent />
    </Suspense>
  );
}

function InventoryContent() {
  return (
    <div className="min-h-screen bg-kairo-bg">
      <Navbar />
      <main className="pt-20">
        <CarGallery />
      </main>
      <Footer />
    </div>
  );
}
