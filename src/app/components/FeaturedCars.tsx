"use client";

import { useState, useEffect } from "react";
import CarCard from "./CarCard";
import CarCardSkeleton from "./CarCardSkeleton";

interface Car {
  id: string;
  image: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  bodyStyle: string;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80&auto=format&fit=crop";

const FALLBACK_FEATURED: Car[] = [];

export default function FeaturedCars() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredCars, setFeaturedCars] = useState<Car[]>(FALLBACK_FEATURED);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setFetchError(null);
    fetch("/api/vehicles?limit=4", { credentials: "include" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (process.env.NODE_ENV === "development") {
            console.error("[FeaturedCars] /api/vehicles error:", res.status, data);
          }
          setFetchError(typeof data?.error === "string" ? data.error : `Failed (${res.status})`);
          return;
        }
        if (data.vehicles?.length > 0) {
          setFeaturedCars(
            data.vehicles.map((v: Record<string, unknown>) => ({
              id: v.id as string,
              image: (v.image || (v.images as string[])?.[0] || DEFAULT_IMAGE) as string,
              make: v.make as string,
              model: v.model as string,
              year: v.year as number,
              price: v.price as number,
              mileage: (v.mileage ?? 0) as number,
              fuelType: (v.fuelType ?? "") as string,
              bodyStyle: (v.bodyStyle ?? "") as string,
            }))
          );
        }
      })
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error("[FeaturedCars] fetch failed:", err);
        }
        setFetchError(err instanceof Error ? err.message : "Network error");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (featuredCars.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCars.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredCars.length]);

  const goToSlide = (index: number) => setCurrentIndex(index);
  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + featuredCars.length) % featuredCars.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % featuredCars.length);

  return (
    <section className="py-20 bg-gradient-to-b from-kairo-surface-muted to-kairo-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-kairo-ink mb-4">
            Featured <span className="text-kairo-gold">Vehicles</span>
          </h2>
          <p className="text-xl text-kairo-ink-muted max-w-2xl mx-auto">
            Hand-picked premium vehicles from our collection
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {loading && (
            <div className="max-w-4xl mx-auto px-4">
              <CarCardSkeleton />
            </div>
          )}
          {fetchError && process.env.NODE_ENV === "development" && (
            <p className="text-center text-amber-400 text-sm mb-4" role="alert">
              Featured cars API: {fetchError}
            </p>
          )}
          {featuredCars.length === 0 && !loading && (
            <div className="text-center text-kairo-ink-muted py-8">No featured vehicles available.</div>
          )}
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {featuredCars.map((car, index) => (
                <div key={car.id} className="min-w-full px-4">
                  <div className="max-w-4xl mx-auto">
                    <CarCard {...car} priority={index === 0} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-kairo-ink/90 hover:bg-kairo-ink text-kairo-deep p-3 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Previous car"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-kairo-ink/90 hover:bg-kairo-ink text-kairo-deep p-3 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Next car"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {featuredCars.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-kairo-gold w-8"
                    : "bg-kairo-border hover:bg-kairo-ink-muted"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}





