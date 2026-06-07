"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { showToast } from "@/lib/toast";

const fieldClass =
  "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-kairo-gold focus:border-transparent";
const labelClass = "block text-sm font-semibold text-gray-800 mb-2";

export default function SellMyCarPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    engine: "",
    price: "",
    phoneNumber: "",
    imageUrl: "",
    description: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const payload = {
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: Number(formData.year),
        mileage: Number(formData.mileage || 0),
        engineType: formData.engine.trim(),
        price: Number(formData.price),
        phoneNumber: formData.phoneNumber.trim(),
        imageUrl: formData.imageUrl.trim(),
        images: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : [],
        description: formData.description.trim(),
        condition: "Used" as const,
        fuelType: "Gasoline",
        bodyStyle: "Sedan",
        location: "Nairobi",
        listingType: "fixed" as const,
      };

      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create listing.");
        showToast(data.error || "Failed to create listing", "error");
        return;
      }

      setMessage("Your car has been listed successfully.");
      showToast("Listing created successfully", "success");
      setTimeout(() => router.push("/seller-dashboard"), 1000);
    } catch {
      setError("Network error. Please try again.");
      showToast("Network error while creating listing", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-kairo-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow border border-kairo-border/30 p-6 sm:p-8 text-gray-900">
          <h1 className="text-3xl font-bold text-kairo-deep mb-2">Sell My Car</h1>
          <p className="text-gray-600 mb-6">List your vehicle in the marketplace.</p>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="make" className={labelClass}>
                Make
              </label>
              <input
                id="make"
                name="make"
                placeholder="e.g. Toyota"
                required
                value={formData.make}
                onChange={onChange}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="model" className={labelClass}>
                Model
              </label>
              <input
                id="model"
                name="model"
                placeholder="e.g. Camry"
                required
                value={formData.model}
                onChange={onChange}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="year" className={labelClass}>
                Year
              </label>
              <input
                id="year"
                name="year"
                placeholder="e.g. 2022"
                type="number"
                required
                value={formData.year}
                onChange={onChange}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="mileage" className={labelClass}>
                Mileage (mi)
              </label>
              <input
                id="mileage"
                name="mileage"
                placeholder="Odometer reading"
                type="number"
                required
                value={formData.mileage}
                onChange={onChange}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="engine" className={labelClass}>
                Engine
              </label>
              <input
                id="engine"
                name="engine"
                placeholder="e.g. 2.5L I4"
                required
                value={formData.engine}
                onChange={onChange}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="price" className={labelClass}>
                Price (USD)
              </label>
              <input
                id="price"
                name="price"
                placeholder="Asking price"
                type="number"
                required
                value={formData.price}
                onChange={onChange}
                className={fieldClass}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="phoneNumber" className={labelClass}>
                Phone number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Seller contact"
                required
                value={formData.phoneNumber}
                onChange={onChange}
                className={fieldClass}
              />
            </div>
            <div className="md:col-span-2">
              <span className={labelClass}>Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className={`${fieldClass} file:mr-4 file:rounded-md file:border-0 file:bg-kairo-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-kairo-deep hover:file:bg-kairo-gold-hover`}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="imageUrl" className={labelClass}>
                Or paste image URL
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                placeholder="https://..."
                value={formData.imageUrl.startsWith("data:image/") ? "" : formData.imageUrl}
                onChange={onChange}
                className={fieldClass}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Condition, service history, features…"
                value={formData.description}
                onChange={onChange}
                className={`${fieldClass} min-h-28 resize-y`}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="md:col-span-2 py-3 bg-kairo-gold text-kairo-deep rounded-lg font-semibold hover:bg-kairo-gold-hover disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? "Submitting..." : "List Vehicle"}
            </button>
          </form>
          {message && <p className="text-green-600 mt-4">{message}</p>}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
