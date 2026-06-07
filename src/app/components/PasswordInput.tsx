"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  variant?: "light" | "dark";
  error?: boolean;
}

export default function PasswordInput({
  variant = "light",
  error,
  className = "",
  ...props
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  const base =
    variant === "dark"
      ? "w-full px-4 py-3 pr-11 rounded-lg bg-kairo-bg border border-kairo-border text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-kairo-gold"
      : `w-full px-4 py-3 pr-11 border rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-kairo-gold focus:border-transparent"
        }`;

  return (
    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        className={`${base} ${className}`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 transition-colors ${
          variant === "dark"
            ? "text-kairo-ink-muted hover:text-kairo-gold"
            : "text-gray-500 hover:text-kairo-gold"
        }`}
        aria-label={show ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {show ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
      </button>
    </div>
  );
}
