"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PasswordInput from "../../components/PasswordInput";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters." });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Reset failed. The link may have expired." });
        return;
      }
      setStatus({ type: "success", message: "Password updated successfully. Redirecting to login..." });
      setTimeout(() => router.push("/login"), 1500);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-kairo-gold">Reset Password</h1>
          <p className="text-sm text-kairo-ink-muted">Enter your new password below.</p>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-kairo-ink-muted mb-2">
              New Password
            </label>
            <PasswordInput
              id="password"
              variant="dark"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-kairo-ink-muted mb-2">
              Confirm Password
            </label>
            <PasswordInput
              id="confirmPassword"
              variant="dark"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-kairo-gold text-kairo-deep font-semibold hover:bg-kairo-gold-hover disabled:opacity-60 transition-colors"
          >
            {loading ? "Updating..." : "Update Password"}
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
