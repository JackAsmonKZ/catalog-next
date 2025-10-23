"use client";

import React, { useEffect, useState } from "react";

type ToastItem = { id: number; message: string };

export default function Toast() {
  const [queue, setQueue] = useState<ToastItem[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onShow = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      const message = detail?.message || String(detail) || "Уведомление";
      setQueue((q) => [...q, { id: Date.now(), message }]);
    };

    window.addEventListener("show_toast", onShow as EventListener);
    return () =>
      window.removeEventListener("show_toast", onShow as EventListener);
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setQueue((q) => q.slice(1)), 300);
    }, 3000);
    return () => clearTimeout(t);
  }, [queue]);

  if (queue.length === 0) return null;

  return (
    <div className="fixed right-4 bottom-6 z-50 pointer-events-none">
      <div
        className={`max-w-xs w-full bg-black text-white px-4 py-2 rounded shadow-lg transform transition-all duration-300 ease-out pointer-events-auto ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {queue[0].message}
      </div>
    </div>
  );
}
