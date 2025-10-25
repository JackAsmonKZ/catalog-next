"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Product, Collection } from "../../../types/types";
import Image from "next/image";
import { tenge } from "@/constants/constants";
import Link from "next/link";

interface Props {
  product: Product;
  collections: Collection[];
}

export default function ClientProduct({ product, collections }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [liked, setLiked] = useState<boolean>(!!product.isLiked);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("catalog_likes");
      if (raw) {
        const map = JSON.parse(raw) as Record<string, boolean>;
        setLiked(!!map[product.id]);
      }
    } catch (e) {}
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
      try {
        window.dispatchEvent(new Event("cart_updated"));
      } catch (e) {}
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
                      ? "bg-[#C2A389] text-white"
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
                className="px-4 py-2 bg-[#C2A389] text-white rounded-md hover:opacity-95 transition-opacity"
              >
                Добавить в корзину
              </button>
            </div>
          </div>

          <div className="mt-6 mb-[15px]">
            <h3 className="text-lg font-medium">Подборки с этим товаром</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {collections.length === 0 && (
                <li className="text-sm text-gray-500">Нет подборок</li>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {collections.map((c) => (
                  <Link key={c.id} href={`/collections/${c.id}`}>
                    <div className="group rounded-2xl bg-[#e0e0e0] shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] p-5 hover:shadow-[12px_12px_24px_#bebebe,-12px_-12px_24px_#ffffff] transition-all duration-300 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-800 font-medium text-sm group-hover:text-[#C2A389] transition-colors duration-300">
                          {c.name}
                        </h3>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-[#C2A389] group-hover:translate-x-1 transition-all duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </ul>
          </div>
        </div>
      </div>

      <div
        className={`fixed left-4 bottom-6 z-50 transition-all duration-300 ${
          toast
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {" "}
        <div className="bg-[#C2A389] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-[fadeIn_0.3s_ease-out]">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      </div>
    </div>
  );
}
