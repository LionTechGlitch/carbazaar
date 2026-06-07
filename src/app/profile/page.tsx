"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Vehicle } from "@/types/vehicle";

type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Buyer" | "Seller" | "Admin";
  fatherName?: string;
  tribalName?: string;
};

type OrderItem = {
  id: string;
  vehicleId: string;
  amount: number;
  currency: string;
  status: string;
  vehicle?: Pick<Vehicle, "year" | "make" | "model"> | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => router.replace("/"))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/orders", { credentials: "include" })
      .then((res) => res.ok ? res.json() : { orders: [] })
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kairo-bg">
        <p className="text-kairo-ink">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-kairo-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-kairo-ink mb-2">Profile</h1>
          <p className="text-kairo-ink-muted mb-8">Your account and activity</p>

          <div className="bg-kairo-surface border border-kairo-border rounded-lg shadow-lg p-6 mb-8 text-kairo-ink">
            <h2 className="text-xl font-semibold text-kairo-gold mb-4">Account</h2>
            <div className="space-y-2 text-kairo-ink-muted">
              <p><span className="font-medium text-kairo-ink">Name:</span> {user.firstName} {user.lastName}</p>
              <p><span className="font-medium text-kairo-ink">Email:</span> {user.email}</p>
              <p><span className="font-medium text-kairo-ink">Role:</span> {user.role}</p>
              {user.fatherName && <p><span className="font-medium text-kairo-ink">Father&apos;s name:</span> {user.fatherName}</p>}
              {user.tribalName && <p><span className="font-medium text-kairo-ink">Tribal / family name:</span> {user.tribalName}</p>}
            </div>
          </div>

          <div className="bg-kairo-surface border border-kairo-border rounded-lg shadow-lg p-6 text-kairo-ink">
            <h2 className="text-xl font-semibold text-kairo-gold mb-4">Your Orders</h2>
            {orders.length === 0 ? (
              <p className="text-kairo-ink-muted mb-4">You have not placed any orders yet.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((o) => (
                  <li key={o.id} className="border border-kairo-border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-kairo-ink">
                          {o.vehicle?.year} {o.vehicle?.make} {o.vehicle?.model}
                        </p>
                        <p className="text-sm text-kairo-ink-muted">
                          {o.status} · {o.currency} {(o.amount * 130).toLocaleString()}
                        </p>
                      </div>
                      <Link href={`/inventory/${o.vehicleId}`} className="text-kairo-gold hover:underline text-sm">
                        View vehicle
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/inventory" className="inline-block mt-4 text-kairo-gold hover:underline font-medium">
              Browse inventory
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
