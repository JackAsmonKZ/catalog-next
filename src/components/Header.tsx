"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Grid,
  Layers,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    const updateCounts = () => {
      try {
        const raw = localStorage.getItem("catalog_cart");
        const arr = raw ? JSON.parse(raw) : [];
        const total = arr.reduce(
          (s: number, it: any) => s + (it.quantity || 0),
          0
        );
        setCartCount(total);
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCounts();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "catalog_cart" || e.key === "catalog_likes") updateCounts();
    };

    const onCartUpdated = () => updateCounts();
    const onLikesUpdated = () => updateCounts();

    window.addEventListener("storage", onStorage);
    window.addEventListener("cart_updated", onCartUpdated);
    window.addEventListener("likes_updated", onLikesUpdated);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart_updated", onCartUpdated);
      window.removeEventListener("likes_updated", onLikesUpdated);
    };
  }, []);

  return (
    <header className="w-full bg-white/80 backdrop-blur sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setOpenMobile((v) => !v)}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 md:hidden"
            aria-label="Menu"
          >
            {openMobile ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <Link
            href="/"
            onClick={() => setOpenMobile(false)}
            className="flex items-center text-sm font-semibold"
          >
            <img src="/logo.png" alt="ROOICELL" width={40} height={40} />
            <span>ROOICELL</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/catalog"
            className="flex items-center gap-2 text-sm hover:text-black"
          >
            <Grid className="w-4 h-4" /> Каталог
          </Link>
          <Link
            href="/collections"
            className="flex items-center gap-2 text-sm hover:text-black"
          >
            <Layers className="w-4 h-4" /> Подборки
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {openMobile && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">
            <Link
              href="/catalog"
              onClick={() => setOpenMobile(false)}
              className="flex items-center gap-2"
            >
              <Grid className="w-5 h-5" /> <span>Каталог</span>
            </Link>
            <Link
              href="/collections"
              onClick={() => setOpenMobile(false)}
              className="flex items-center gap-2"
            >
              <Layers className="w-5 h-5" /> <span>Подборки</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
