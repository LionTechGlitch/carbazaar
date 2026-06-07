"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "./components/PasswordInput";

type FormErrors = Record<string, string | undefined>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    tribalName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Buyer" as "Buyer" | "Seller" | "Admin",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    const newErrors: FormErrors = {};

    if (!loginData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!loginData.password) {
      newErrors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ submit: data.error || "Login failed" });
        setIsSubmitting(false);
        return;
      }
      router.push("/home");
    } catch {
      setErrors({ submit: "Network error. Please try again." });
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    const newErrors: FormErrors = {};

    if (!signupData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!signupData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!signupData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(signupData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!signupData.password) {
      newErrors.password = "Password is required";
    } else if (signupData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          firstName: signupData.firstName.trim(),
          lastName: signupData.lastName.trim(),
          fatherName: signupData.fatherName?.trim() || undefined,
          tribalName: signupData.tribalName?.trim() || undefined,
          role: signupData.role,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ submit: data.error || "Registration failed" });
        setIsSubmitting(false);
        return;
      }
      router.push("/home");
    } catch {
      setErrors({ submit: "Network error. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-kairo-gold via-kairo-gold-muted to-kairo-deep relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold mb-4">
              <span className="text-white">Car</span>
              <span className="text-kairo-gold">Bazaar</span>
            </h1>
            <p className="text-2xl text-gray-100 mb-8">
              Your Gateway to Premium Vehicles
            </p>
            <div className="space-y-4 text-lg text-gray-200">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-kairo-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Premium Vehicle Collection</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-kairo-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Trusted Sellers</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-kairo-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Easy Buying Process</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold">
              <span className="text-kairo-deep">Car</span>
              <span className="text-kairo-gold">Bazaar</span>
            </h1>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-white rounded-lg p-1 mb-8 shadow-md">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrors({});
              }}
              className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
                isLogin
                  ? "bg-kairo-gold text-kairo-deep shadow-md"
                  : "text-gray-600 hover:text-kairo-gold"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrors({});
              }}
              className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
                !isLogin
                  ? "bg-kairo-gold text-kairo-deep shadow-md"
                  : "text-gray-600 hover:text-kairo-gold"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {isLogin && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-kairo-deep mb-2">
                  Welcome <span className="text-kairo-gold">Back</span>
                </h2>
                <p className="text-gray-600">Sign in to continue to Car Bazaar</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-kairo-gold focus:border-transparent"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <PasswordInput
                    id="login-password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    error={!!errors.password}
                    placeholder="Enter your password"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 text-kairo-gold border-gray-300 rounded focus:ring-kairo-gold"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <a href="/forgot-password" className="text-sm text-kairo-gold hover:underline font-medium">
                    Forgot password?
                  </a>
                </div>

                {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-kairo-gold text-kairo-deep font-semibold rounded-lg hover:bg-kairo-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          )}

          {/* Signup Form */}
          {!isLogin && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-kairo-deep mb-2">
                  Create Your <span className="text-kairo-gold">Account</span>
                </h2>
                <p className="text-gray-600">Join Car Bazaar and start your journey</p>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={signupData.firstName}
                      onChange={handleSignupChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.firstName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-kairo-gold focus:border-transparent"
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={signupData.lastName}
                      onChange={handleSignupChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.lastName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-kairo-gold focus:border-transparent"
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fatherName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Father&apos;s name <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="fatherName"
                      name="fatherName"
                      value={signupData.fatherName}
                      onChange={handleSignupChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
                      placeholder="e.g. Ahmad"
                    />
                  </div>
                  <div>
                    <label htmlFor="tribalName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Tribal / family name <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="tribalName"
                      name="tribalName"
                      value={signupData.tribalName}
                      onChange={handleSignupChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
                      placeholder="e.g. Khan"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                    I want to
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={signupData.role}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kairo-gold focus:border-transparent"
                  >
                    <option value="Buyer">Buy vehicles</option>
                    <option value="Seller">Sell vehicles</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-kairo-gold focus:border-transparent"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <PasswordInput
                    id="signup-password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    error={!!errors.password}
                    placeholder="At least 8 characters"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    error={!!errors.confirmPassword}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-kairo-gold border-gray-300 rounded focus:ring-kairo-gold"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-kairo-gold hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-kairo-gold hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-kairo-gold text-kairo-deep font-semibold rounded-lg hover:bg-kairo-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
