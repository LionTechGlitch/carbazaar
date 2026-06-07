"use client";

import { useEffect, useState } from "react";

type Toast = { id: number; message: string; type: "success" | "error" | "info" };

export default function ToastViewport() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ message: string; type: "success" | "error" | "info" }>;
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message: custom.detail.message, type: custom.detail.type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    };
    window.addEventListener("carbazaar:toast", handler as EventListener);
    return () => window.removeEventListener("carbazaar:toast", handler as EventListener);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg border ${
            t.type === "success"
              ? "bg-green-900/90 text-white border-green-700"
              : t.type === "error"
              ? "bg-red-900/90 text-white border-red-700"
              : "bg-[#1e1e22] text-white border-[#3a3a42]"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
