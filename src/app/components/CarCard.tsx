"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface CarCardProps {
  id: string;
  image: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  bodyStyle: string;
  priority?: boolean;
}

export default function CarCard({
  id,
  image,
  make,
  model,
  year,
  price,
  mileage,
  fuelType,
  bodyStyle,
  priority = false,
}: CarCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("en-US").format(mileage);
  };

  return (
    <Link href={`/inventory/${id}`} className="block">
      <div
        className="group relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <Image
          src={image}
          alt={`${year} ${make} ${model}`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        {/* Price Overlay */}
        <div className="absolute top-4 right-4 bg-kairo-deep/90 backdrop-blur-sm text-kairo-ink px-4 py-2 rounded-lg border border-kairo-border/60">
          <span className="text-2xl font-bold text-kairo-gold">{formatPrice(price)}</span>
        </div>
        {/* Quick View Overlay */}
        <div
          className={`absolute inset-0 bg-kairo-deep/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="px-6 py-3 bg-kairo-gold text-kairo-deep font-semibold rounded-md">
            View Details
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-kairo-deep mb-2">
          {year} {make} {model}
        </h3>
        <p className="text-gray-600 mb-4 capitalize">{bodyStyle}</p>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col items-center">
            <svg
              className="w-6 h-6 text-kairo-gold mb-1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-600">{year}</span>
          </div>
          <div className="flex flex-col items-center">
            <svg
              className="w-6 h-6 text-kairo-gold mb-1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm text-gray-600">{formatMileage(mileage)} mi</span>
          </div>
          <div className="flex flex-col items-center">
            <svg
              className="w-6 h-6 text-kairo-gold mb-1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm text-gray-600 capitalize">{fuelType}</span>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
}





