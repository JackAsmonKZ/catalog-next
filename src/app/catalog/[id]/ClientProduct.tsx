"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Product, Collection } from "../../../types/types";
import Image from "next/image";
import { tenge } from "@/constants/constants";

interface Props {
  product: Product;
  collections: Collection[];
}

export default function ClientProduct({ product, collections }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [liked, setLiked] = useState<boolean>(!!product.isLiked);
  const [toast, setToast] = useState<string | null>(null);

  // Initialize liked from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("catalog_likes");
      if (raw) {
        const map = JSON.parse(raw) as Record<string, boolean>;
        setLiked(!!map[product.id]);
      }
    } catch (e) {
      // ignore
    }
  }, [product.id]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const price = useMemo(() => {
    const v = product.volumes[selectedIndex];
    return v ? v.price : 0;
  }, [product.volumes, selectedIndex]);

  const toggleLike = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const raw = localStorage.getItem("catalog_likes");
      const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
      map[product.id] = !map[product.id];
      localStorage.setItem("catalog_likes", JSON.stringify(map));
      setLiked(!!map[product.id]);
      try {
        window.dispatchEvent(new Event("likes_updated"));
      } catch {}
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const raw = localStorage.getItem("catalog_cart");
      const cart: {
        productId: string;
        volumeIndex: number;
        quantity: number;
      }[] = raw ? JSON.parse(raw) : [];

      const existing = cart.find(
        (it) => it.productId === product.id && it.volumeIndex === selectedIndex
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          productId: product.id,
          volumeIndex: selectedIndex,
          quantity: 1,
        });
      }
      localStorage.setItem("catalog_cart", JSON.stringify(cart));
      // notify other listeners in the same tab
      try {
        window.dispatchEvent(new Event("cart_updated"));
      } catch (e) {
        // ignore
      }
      setToast("Добавлено в корзину");
      try {
        window.dispatchEvent(
          new CustomEvent("show_toast", {
            detail: { message: "Добавлено в корзину" },
          })
        );
      } catch {}
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            className="w-full h-72 md:h-full object-cover"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMCIgd2lkdGg9IjEwMCI+PC9zdmc+"
          />
        </div>

        <div className="md:w-1/2 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              <p className="text-sm text-gray-500 mt-2">
                {product.description}
              </p>
            </div>

            <button
              onClick={toggleLike}
              className={`ml-4 p-2 rounded-full transition-colors ${
                liked ? "bg-red-100 text-red-600" : "bg-white text-gray-500"
              }`}
              aria-label="like"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M12 21s-7.5-4.35-10-7.5C-0.5 9 4 4 8.5 6.5 11 8 12 10 12 10s1-2 3.5-3.5C20 4 24.5 9 22 13.5 19.5 16.65 12 21 12 21z" />
              </svg>
            </button>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium mb-2">
              Выберите объем
            </label>
            <div className="flex gap-2 flex-wrap">
              {product.volumes.map((v, idx) => (
                <label
                  key={v.volume}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md border cursor-pointer transition-colors ${
                    idx === selectedIndex
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="volume"
                    checked={idx === selectedIndex}
                    onChange={() => setSelectedIndex(idx)}
                    className="hidden"
                  />
                  <span className="text-sm">{v.volume}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-xl font-semibold">
              {price} {tenge}
            </div>
            <div className="flex gap-3">
              <button
                onClick={addToCart}
                className="px-4 py-2 bg-black text-white rounded-md hover:opacity-95 transition-opacity"
              >
                Добавить в корзину
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium">Подборки с этим товаром</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {collections.length === 0 && (
                <li className="text-sm text-gray-500">Нет подборок</li>
              )}
              {collections.map((c) => (
                <li key={c.id}>
                  <a
                    href={`/collections/${c.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed left-4 bottom-6 z-50">
          <div className="bg-black text-white px-2 py-1 rounded shadow">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
