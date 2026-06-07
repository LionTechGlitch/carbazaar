"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Failed to send reset link. Please try again." });
        return;
      }
      setStatus({
        type: "success",
        message: "If that email exists, a reset link has been sent. Check your inbox (and spam folder).",
      });
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-kairo-bg text-kairo-ink">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md bg-kairo-surface border border-kairo-border rounded-xl p-6 sm:p-8 space-y-4"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-kairo-gold">Forgot Password</h1>
          <p className="text-sm text-kairo-ink-muted">
            Enter your account email and we&apos;ll send you a link to reset your password. The link expires in 1 hour.
          </p>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-kairo-ink-muted mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-kairo-bg border border-kairo-border text-kairo-ink placeholder:text-kairo-ink-subtle focus:outline-none focus:ring-2 focus:ring-kairo-gold"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-kairo-gold text-kairo-deep font-semibold hover:bg-kairo-gold-hover disabled:opacity-60 transition-colors"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          {status && (
            <p
              className={`text-sm rounded-lg px-3 py-2 ${
                status.type === "success"
                  ? "bg-green-900/30 text-green-300 border border-green-700/50"
                  : "bg-red-900/30 text-red-300 border border-red-700/50"
              }`}
              role="alert"
            >
              {status.message}
            </p>
          )}
          <Link href="/login" className="inline-block text-kairo-gold text-sm hover:underline">
            Back to login
          </Link>
        </form>
      </main>
      <Footer />
    </div>
  );
}
