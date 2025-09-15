"use client";

import { createContext, useContext, useState } from "react";

type ToastItem = { id: number; type: "success" | "error"; message: string };

const ToastContext = createContext<{
  push: (t: Omit<ToastItem, "id">) => void;
} | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  function push(t: Omit<ToastItem, "id">) {
    const id = Date.now();
    setItems((prev) => [...prev, { id, ...t }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 3500);
  }
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {items.map((i) => (
          <div key={i.id} className={`px-4 py-2 rounded-md shadow text-sm ${i.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
            {i.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

