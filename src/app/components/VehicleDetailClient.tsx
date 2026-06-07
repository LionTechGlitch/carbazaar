"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { Vehicle } from "@/types/vehicle";

interface VehicleDetailClientProps {
  id: string;
  car: Vehicle | null;
  userId: string | null;
}

export default function VehicleDetailClient({ id, car, userId }: VehicleDetailClientProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    price: String(car?.price ?? ""),
    description: car?.description ?? "",
    imageUrl: car?.imageUrl ?? car?.image ?? "",
    isSold: !!car?.isSold,
  });

  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryData, setEnquiryData] = useState({ buyerName: "", buyerEmail: "", buyerPhone: "", message: "" });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState("");

  const user = userId ? { id: userId } : null;
  const isOwner = !!(user && car?.sellerId && user.id === car.sellerId);

  if (!car) {
    return (
      <div className="min-h-screen bg-kairo-bg text-kairo-ink flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-kairo-ink text-lg">Vehicle not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const images = car.images?.length ? car.images : [car.image || ""];

  const handleEnquirySubmit = async () => {
    setEnquiryLoading(true);
    setEnquiryError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: id,
          ...enquiryData,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEnquiryError(data.error || "Failed to send enquiry");
      } else {
        setEnquirySuccess(true);
        setEnquiryData({ buyerName: "", buyerEmail: "", buyerPhone: "", message: "" });
      }
    } catch {
      setEnquiryError("Something went wrong. Please try again.");
    } finally {
      setEnquiryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kairo-bg text-kairo-ink">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="relative w-full h-[280px] sm:h-[360px] rounded-xl border border-kairo-border overflow-hidden">
              <Image
                src={images[0]}
                alt={`${car.make} ${car.model}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {images.slice(0, 3).map((img, idx) => (
                <div key={idx} className="relative w-full h-24 rounded-lg border border-kairo-border overflow-hidden">
                  <Image
                    src={img}
                    alt={`${car.make} ${idx}`}
                    fill
                    sizes="(max-width: 1024px) 33vw, 15vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-kairo-surface border border-kairo-border rounded-xl p-6">
            <h1 className="text-3xl font-bold text-kairo-gold">
              {car.year} {car.make} {car.model}
            </h1>
            <p className="text-kairo-ink-muted mt-2">{car.description || "No description provided."}</p>
            <p className="text-2xl mt-4 font-semibold text-kairo-ink">USD {car.price.toLocaleString()}</p>
            <p className="text-sm text-kairo-ink-muted mt-1">
              {car.mileage?.toLocaleString()} mi · {car.fuelType} · {car.bodyStyle}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setShowEnquiry((prev) => !prev)}
                className="px-5 py-3 rounded-lg bg-kairo-gold text-kairo-deep font-semibold hover:bg-kairo-gold-hover transition-colors"
              >
                {showEnquiry ? "Hide Form" : "Contact Seller"}
              </button>
              <button
                disabled
                title="Coming Soon"
                className="px-5 py-3 rounded-lg bg-kairo-panel text-kairo-ink-muted cursor-not-allowed border border-kairo-border"
              >
                Pay via M-Pesa <span className="ml-2 text-xs">Coming Soon</span>
              </button>
            </div>

            {showEnquiry && (
              <div className="mt-6 border border-kairo-border rounded-xl p-4 space-y-3 bg-kairo-bg">
                <h3 className="text-kairo-gold font-semibold text-lg">Send Enquiry</h3>
                {enquirySuccess ? (
                  <div className="text-green-400 font-medium py-4 text-center">
                    ✅ Enquiry sent successfully! The seller will be in touch.
                  </div>
                ) : (
                  <>
                    <input
                      value={enquiryData.buyerName}
                      onChange={(e) => setEnquiryData((d) => ({ ...d, buyerName: e.target.value }))}
                      placeholder="Your Name"
                      className="w-full px-3 py-2 rounded bg-kairo-surface border border-kairo-border text-neutral-100 placeholder:text-neutral-500"
                    />
                    <input
                      value={enquiryData.buyerEmail}
                      onChange={(e) => setEnquiryData((d) => ({ ...d, buyerEmail: e.target.value }))}
                      placeholder="Your Email"
                      type="email"
                      className="w-full px-3 py-2 rounded bg-kairo-surface border border-kairo-border text-neutral-100 placeholder:text-neutral-500"
                    />
                    <input
                      value={enquiryData.buyerPhone}
                      onChange={(e) => setEnquiryData((d) => ({ ...d, buyerPhone: e.target.value }))}
                      placeholder="Your Phone Number"
                      type="tel"
                      className="w-full px-3 py-2 rounded bg-kairo-surface border border-kairo-border text-neutral-100 placeholder:text-neutral-500"
                    />
                    <textarea
                      value={enquiryData.message}
                      onChange={(e) => setEnquiryData((d) => ({ ...d, message: e.target.value }))}
                      placeholder="Your message e.g. Is this car still available?"
                      className="w-full px-3 py-2 rounded bg-kairo-surface border border-kairo-border text-neutral-100 placeholder:text-neutral-500 min-h-24"
                    />
                    {enquiryError && <p className="text-red-400 text-sm">{enquiryError}</p>}
                    <button
                      onClick={handleEnquirySubmit}
                      disabled={enquiryLoading}
                      className="w-full px-4 py-3 rounded-lg bg-kairo-gold text-kairo-deep font-semibold hover:bg-kairo-gold-hover transition-colors disabled:opacity-50"
                    >
                      {enquiryLoading ? "Sending..." : "Send Enquiry"}
                    </button>
                  </>
                )}
              </div>
            )}

            {isOwner && (
              <div className="mt-8 border-t border-kairo-border pt-4 space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditing((e) => !e)}
                    className="px-4 py-2 rounded bg-kairo-panel border border-kairo-border text-kairo-ink hover:bg-kairo-border/40 transition-colors"
                  >
                    Edit Listing
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this listing?")) return;
                      const res = await fetch(`/api/vehicles/${car.id}`, {
                        method: "DELETE",
                        credentials: "include",
                      });
                      if (res.ok) router.push("/seller-dashboard");
                    }}
                    className="px-4 py-2 rounded bg-red-900/40 border border-red-700 text-red-300"
                  >
                    Delete Listing
                  </button>
                </div>
                {editing && (
                  <div className="space-y-2">
                    <input
                      value={editData.price}
                      onChange={(e) => setEditData((d) => ({ ...d, price: e.target.value }))}
                      className="w-full px-3 py-2 rounded bg-kairo-bg border border-kairo-border text-neutral-100 placeholder:text-neutral-500"
                      placeholder="Price (USD)"
                    />
                    <input
                      value={editData.imageUrl}
                      onChange={(e) => setEditData((d) => ({ ...d, imageUrl: e.target.value }))}
                      className="w-full px-3 py-2 rounded bg-kairo-bg border border-kairo-border text-neutral-100 placeholder:text-neutral-500"
                      placeholder="Image URL"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData((d) => ({ ...d, description: e.target.value }))}
                      className="w-full px-3 py-2 rounded bg-kairo-bg border border-kairo-border text-neutral-100 placeholder:text-neutral-500 min-h-24"
                      placeholder="Description"
                    />
                    <label className="flex items-center gap-2 text-sm text-kairo-ink-muted">
                      <input
                        type="checkbox"
                        checked={editData.isSold}
                        onChange={(e) => setEditData((d) => ({ ...d, isSold: e.target.checked }))}
                      />
                      Mark as sold
                    </label>
                    <button
                      onClick={async () => {
                        const res = await fetch(`/api/vehicles/${car.id}`, {
                          method: "PUT",
                          credentials: "include",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            price: Number(editData.price),
                            description: editData.description,
                            imageUrl: editData.imageUrl,
                            images: editData.imageUrl ? [editData.imageUrl] : [],
                            isSold: editData.isSold,
                          }),
                        });
                        if (res.ok) window.location.reload();
                      }}
                      className="px-4 py-2 rounded bg-kairo-gold text-kairo-deep font-semibold hover:bg-kairo-gold-hover transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
