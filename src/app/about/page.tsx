"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-kairo-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-bold text-kairo-ink mb-6">
            About <span className="text-kairo-gold">Car Bazaar</span>
          </h1>
          <div className="prose prose-lg max-w-none text-kairo-ink-muted space-y-6">
            <p>
              Car Bazaar is your trusted marketplace for buying and selling quality vehicles. We connect buyers with verified sellers across Kenya and beyond.
            </p>
            <h2 className="text-2xl font-semibold text-kairo-ink mt-8">Our Mission</h2>
            <p>
              To make car buying and selling transparent, simple, and secure. Whether you are looking for a family SUV in Nairobi or a sedan in Mombasa, we help you find the right vehicle at a fair price.
            </p>
            <h2 className="text-2xl font-semibold text-kairo-ink mt-8">Why Choose Us</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Wide selection of new and used vehicles</li>
              <li>Verified sellers and transparent listings</li>
              <li>Search by make, model, price, and location</li>
              <li>Secure ordering and payment options (M-Pesa, PayPal)</li>
              <li>Support for both fixed-price and auction listings</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
