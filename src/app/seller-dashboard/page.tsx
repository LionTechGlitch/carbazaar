"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Vehicle } from "@/types/vehicle";

type DashboardUser = {
  id: string;
  role: "Buyer" | "Seller" | "Admin";
};

type Enquiry = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message: string;
  createdAt: string;
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    image: string;
  } | null;
};

export default function SellerDashboardPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"listings" | "enquiries">("listings");

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          router.replace("/login?redirect=seller-dashboard");
          return;
        }
        const data = await res.json();
        if (data.user.role !== "Seller" && data.user.role !== "Admin") {
          setError("You need a Seller account to access this page.");
          setUser(data.user);
        } else {
          setUser(data.user);
        }
      } catch {
        router.replace("/login?redirect=seller-dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchAuth();
  }, [router]);

  useEffect(() => {
    if (!user || (user.role !== "Seller" && user.role !== "Admin")) return;

    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/seller/vehicles", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setVehicles(data.vehicles || []);
      } catch {
        setError("Failed to load your listings.");
      }
    };

    const fetchEnquiries = async () => {
      try {
        const res = await fetch("/api/enquiries", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load enquiries");
        const data = await res.json();
        setEnquiries(data.enquiries || []);
      } catch {
        console.error("Failed to load enquiries");
      }
    };

    fetchVehicles();
    fetchEnquiries();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kairo-bg">
        <p className="text-kairo-ink">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-kairo-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8 pt-24">
          <div className="text-center max-md">
            <p className="text-kairo-ink-muted mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="px-4 py-2 bg-kairo-gold text-kairo-deep rounded-lg hover:bg-kairo-gold-hover font-semibold"
              >
                Sign up as Seller
              </Link>
              <Link
                href="/home"
                className="px-4 py-2 border border-kairo-gold text-kairo-gold rounded-lg hover:bg-kairo-gold/10 font-semibold"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-kairo-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-kairo-ink mb-2">Seller Dashboard</h1>
          <p className="text-kairo-ink-muted mb-8">Manage your listings and enquiries</p>

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-4 mb-6 border-b border-kairo-border overflow-x-auto">
            <button
              onClick={() => setActiveTab("listings")}
              className={`pb-3 px-2 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "listings"
                  ? "text-kairo-gold border-b-2 border-kairo-gold"
                  : "text-kairo-ink-muted hover:text-kairo-ink"
              }`}
            >
              My Listings ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveTab("enquiries")}
              className={`pb-3 px-2 font-semibold transition-colors whitespace-nowrap ${
                activeTab === "enquiries"
                  ? "text-kairo-gold border-b-2 border-kairo-gold"
                  : "text-kairo-ink-muted hover:text-kairo-ink"
              }`}
            >
              Enquiries ({enquiries.length})
            </button>
          </div>

          {/* Listings Tab */}
          {activeTab === "listings" && (
            <div className="bg-kairo-surface border border-kairo-border rounded-lg shadow p-6 text-kairo-ink">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold text-kairo-gold">Your Listings</h2>
                <Link
                  href="/sell-my-car"
                  className="px-4 py-2 bg-kairo-gold text-kairo-deep rounded-lg hover:bg-kairo-gold-hover font-semibold text-sm"
                >
                  + Add Listing
                </Link>
              </div>
              {vehicles.length === 0 ? (
                <p className="text-kairo-ink-muted">
                  You have no listings yet. Use the Sell My Car page to create your first listing.
                </p>
              ) : (
                <ul className="space-y-4">
                  {vehicles.map((v) => (
                    <li
                      key={v.id}
                      className="border border-kairo-border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                    >
                      <div>
                        <p className="font-semibold text-kairo-ink">
                          {v.year} {v.make} {v.model}
                        </p>
                        <p className="text-sm text-kairo-ink-muted">
                          {v.location} · {v.listingType} · {v.isSold ? "Sold" : "Available"}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="font-semibold text-kairo-gold">USD {v.price.toLocaleString()}</p>
                        <Link
                          href={`/inventory/${v.id}`}
                          className="text-xs text-kairo-ink-muted hover:text-kairo-gold transition-colors"
                        >
                          View listing &rarr;
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Enquiries Tab */}
          {activeTab === "enquiries" && (
            <div className="bg-kairo-surface border border-kairo-border rounded-lg shadow p-6 text-kairo-ink">
              <h2 className="text-xl font-semibold text-kairo-gold mb-6">Buyer Enquiries</h2>
              {enquiries.length === 0 ? (
                <p className="text-kairo-ink-muted">No enquiries yet. They will appear here when buyers contact you.</p>
              ) : (
                <ul className="space-y-4">
                  {enquiries.map((e) => (
                    <li key={e.id} className="border border-kairo-border rounded-lg p-4 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <p className="font-semibold text-kairo-ink">{e.buyerName}</p>
                          <p className="text-sm text-kairo-ink-muted">{e.buyerEmail} · {e.buyerPhone}</p>
                        </div>
                        <div className="text-right text-xs text-kairo-ink-muted">
                          {e.vehicle ? (
                            <p className="text-kairo-gold font-medium">
                              {e.vehicle.year} {e.vehicle.make} {e.vehicle.model}
                            </p>
                          ) : null}
                          <p>{new Date(e.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-kairo-ink-muted text-sm bg-kairo-bg rounded p-3 border border-kairo-border">
                        {e.message}
                      </p>
                      <a
                        href={`mailto:${e.buyerEmail}`}
  className="inline-block mt-1 px-4 py-2 bg-kairo-gold text-kairo-deep rounded-lg text-sm font-semibold hover:bg-kairo-gold-hover transition-colors"
>
  Reply via Email
</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}