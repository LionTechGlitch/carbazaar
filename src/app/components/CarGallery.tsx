"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import CarCard from "./CarCard";
import CarCardSkeleton from "./CarCardSkeleton";
import FilterSidebar, { FilterState } from "./FilterSidebar";

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

const FALLBACK_CARS: Car[] = [];

export default function CarGallery() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [filters, setFilters] = useState<FilterState>({
    make: "All",
    model: searchQuery,
    minPrice: "",
    maxPrice: "",
    bodyStyle: "All",
    location: "All",
  });
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery && filters.model !== searchQuery) {
      setFilters((f) => ({ ...f, model: searchQuery }));
    }
  }, [searchQuery, filters.model]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#inventory") {
      setTimeout(() => document.getElementById("inventory")?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.make && filters.make !== "All") params.set("make", filters.make);
    if (filters.model?.trim()) params.set("q", filters.model.trim());
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.bodyStyle && filters.bodyStyle !== "All") params.set("bodyStyle", filters.bodyStyle);
    if (filters.location && filters.location !== "All") params.set("location", filters.location);
    return params.toString();
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    setFetchError(null);
    fetch(`/api/vehicles?${queryString}`, { credentials: "include" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg =
            typeof data?.error === "string"
              ? data.error
              : `Request failed (${res.status})`;
          if (process.env.NODE_ENV === "development") {
            console.error("[CarGallery] /api/vehicles error:", res.status, data);
          }
          setFetchError(msg);
          setCars(FALLBACK_CARS);
          return;
        }
        if (data.vehicles && Array.isArray(data.vehicles) && data.vehicles.length > 0) {
          setCars(
            data.vehicles.map((v: Car & { imageUrl?: string; images?: string[] }) => ({
              id: v.id,
              image: v.image || v.imageUrl || v.images?.[0] || DEFAULT_IMAGE,
              make: v.make,
              model: v.model,
              year: v.year,
              price: v.price,
              mileage: v.mileage ?? 0,
              fuelType: v.fuelType ?? "",
              bodyStyle: v.bodyStyle ?? "",
            }))
          );
        } else {
          setCars(FALLBACK_CARS);
        }
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Network error";
        if (process.env.NODE_ENV === "development") {
          console.error("[CarGallery] /api/vehicles fetch failed:", err);
        }
        setFetchError(msg);
        setCars(FALLBACK_CARS);
      })
      .finally(() => setLoading(false));
  }, [queryString]);

  const filteredCars = useMemo(() => cars, [cars]);

  return (
    <section id="inventory" className="py-20 bg-kairo-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-kairo-ink mb-4">
            Browse Our <span className="text-kairo-gold">Inventory</span>
          </h2>
          <p className="text-xl text-kairo-ink-muted max-w-2xl mx-auto">
            Explore our extensive collection of premium vehicles
          </p>
        </div>
        {fetchError && process.env.NODE_ENV === "development" && (
          <div
            className="mb-8 rounded-lg border border-amber-500/50 bg-amber-950/40 px-4 py-3 text-sm text-amber-100"
            role="alert"
          >
            <p className="font-semibold">Inventory API error (dev only)</p>
            <p className="mt-1 opacity-90">{fetchError}</p>
            <p className="mt-2 text-xs text-amber-200/80">
              Check MongoDB is running and <code className="rounded bg-black/30 px-1">MONGODB_URI</code> in{" "}
              <code className="rounded bg-black/30 px-1">.env.local</code> is correct. Run{" "}
              <code className="rounded bg-black/30 px-1">npm run seed</code> to add sample listings.
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-1/4">
            <FilterSidebar onFilterChange={setFilters} />
          </div>

          {/* Car Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-kairo-ink-muted">
                Showing <span className="font-semibold text-kairo-ink">{filteredCars.length}</span>{" "}
                vehicles
              </p>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <CarCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car, index) => (
                  <CarCard key={car.id} {...car} priority={index < 3} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-kairo-ink-muted">No vehicles found matching your criteria.</p>
                <p className="text-kairo-ink-subtle mt-2">Try adjusting your filters or run npm run seed if the database is empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}





