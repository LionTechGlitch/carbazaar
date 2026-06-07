"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

function navClass(active: boolean) {
  return active
    ? "text-kairo-gold font-semibold"
    : "text-kairo-ink/90 hover:text-kairo-gold transition-colors font-medium";
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data?.user ? setUser(data.user) : setUser(null)))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setUser(null);
      setIsMenuOpen(false);
      showToast("Logged out successfully", "success");
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = (
    <>
      <Link href="/home" className={navClass(pathname === "/home")}>
        Home
      </Link>
      <Link href="/inventory" className={navClass(pathname === "/inventory")}>
        Inventory
      </Link>
      <Link href="/about" className={navClass(pathname === "/about")}>
        About
      </Link>
      <Link href="/contact" className={navClass(pathname === "/contact")}>
        Contact
      </Link>
      <Link href="/seller-dashboard" className={navClass(pathname === "/seller-dashboard")}>
        Seller Dashboard
      </Link>
      <Link href="/sell-my-car" className={navClass(pathname === "/sell-my-car")}>
        Sell My Car
      </Link>
      {user ? (
        <>
          <Link href="/profile" className={navClass(pathname === "/profile")}>
            Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="hover:text-kairo-gold transition-colors font-medium disabled:opacity-60 text-left"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className={navClass(pathname === "/login")}>
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg bg-kairo-gold text-kairo-deep font-semibold hover:bg-kairo-gold-hover transition-colors"
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-b from-kairo-deep/95 to-transparent text-kairo-ink z-50 backdrop-blur-sm border-b border-kairo-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link href="/home" className="text-xl sm:text-2xl font-bold tracking-tight">
            <span className="text-kairo-ink">Car</span>
            <span className="text-kairo-gold">Bazaar</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-kairo-border/40 pt-4">
            <Link href="/home" className={`block ${navClass(pathname === "/home")}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/inventory" className={`block ${navClass(pathname === "/inventory")}`} onClick={() => setIsMenuOpen(false)}>Inventory</Link>
            <Link href="/about" className={`block ${navClass(pathname === "/about")}`} onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link href="/contact" className={`block ${navClass(pathname === "/contact")}`} onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <Link href="/seller-dashboard" className={`block ${navClass(pathname === "/seller-dashboard")}`} onClick={() => setIsMenuOpen(false)}>Seller Dashboard</Link>
            <Link href="/sell-my-car" className={`block ${navClass(pathname === "/sell-my-car")}`} onClick={() => setIsMenuOpen(false)}>Sell My Car</Link>
            {user ? (
              <>
                <Link href="/profile" className={`block ${navClass(pathname === "/profile")}`} onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="block hover:text-kairo-gold transition-colors font-medium disabled:opacity-60"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`block ${navClass(pathname === "/login")}`} onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link
                  href="/signup"
                  className="inline-block px-4 py-2 rounded-lg bg-kairo-gold text-kairo-deep font-semibold hover:bg-kairo-gold-hover transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
