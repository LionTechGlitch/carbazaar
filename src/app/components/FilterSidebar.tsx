"use client";

import { useState } from "react";

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  make: string;
  model: string;
  minPrice: string;
  maxPrice: string;
  bodyStyle: string;
  location: string;
}

const makes = ["All", "Tesla", "BMW", "Mercedes-Benz", "Audi", "Porsche", "Jaguar", "Lexus"];
const bodyStyles = ["All", "Sedan", "SUV", "Coupe", "Convertible", "Hatchback", "Truck"];
const locations = ["All", "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    make: "All",
    model: "",
    minPrice: "",
    maxPrice: "",
    bodyStyle: "All",
    location: "All",
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const reset = {
      make: "All",
      model: "",
      minPrice: "",
      maxPrice: "",
      bodyStyle: "All",
      location: "All",
    };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-3 bg-kairo-deep text-kairo-ink rounded-lg font-semibold flex items-center justify-between border border-kairo-border"
        >
          <span>Filters</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Sidebar */}
      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-6 lg:mb-0 lg:sticky lg:top-24 text-gray-900`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-kairo-deep">Filters</h3>
          <button
            onClick={resetFilters}
            className="text-sm text-kairo-gold hover:underline font-medium"
          >
            Reset
          </button>
        </div>

        {/* Make Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Make</label>
          <select
            value={filters.make}
            onChange={(e) => handleFilterChange("make", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
          >
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        {/* Model Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
          <input
            type="text"
            placeholder="Enter model..."
            value={filters.model}
            onChange={(e) => handleFilterChange("model", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
          />
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Body Style */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Body Style</label>
          <select
            value={filters.bodyStyle}
            onChange={(e) => handleFilterChange("bodyStyle", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
          >
            {bodyStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </aside>
    </>
  );
}





