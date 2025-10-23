"use client";

import React, { useState } from "react";
import type { Collection, Product } from "../../../types/types";
import Image from "next/image";
import { tenge } from "@/constants/constants";

interface Props {
  collection: Collection;
  products: (Product & { recommendedVolumeIndex: number })[];
}

export default function ClientCollection({ collection, products }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const total = products.reduce(
    (s, p) => s + (p.volumes[p.recommendedVolumeIndex]?.price || 0),
    0
  );

  const addAllToCart = () => {
    try {
      const raw = localStorage.getItem("catalog_cart");
      const cart: {
        productId: string;
        volumeIndex: number;
        quantity: number;
      }[] = raw ? JSON.parse(raw) : [];

      products.forEach((p) => {
        const existing = cart.find(
          (it) =>
            it.productId === p.id && it.volumeIndex === p.recommendedVolumeIndex
        );
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({
            productId: p.id,
            volumeIndex: p.recommendedVolumeIndex,
            quantity: 1,
          });
        }
      });

      localStorage.setItem("catalog_cart", JSON.stringify(cart));
      try {
        window.dispatchEvent(new Event("cart_updated"));
        window.dispatchEvent(
          new CustomEvent("show_toast", {
            detail: { message: "Добавлено в корзину: подборка" },
          })
        );
      } catch (e) {
        // ignore
      }
      setToast("Подборка добавлена в корзину");
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="bg-white p-2 rounded-lg shadow-sm">
        <div className="flex items-center justify-center flex-wrap gap-[10px]">
          <div>
            <h1 className="text-2xl font-semibold">{collection.name}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {collection.description}
            </p>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Общая сумма</div>
            <div className="text-2xl font-bold text-green-600">
              {total} {tenge}
            </div>
            <button
              onClick={addAllToCart}
              className="mt-3 px-4 py-2 bg-black text-white rounded-md"
            >
              Добавить всю подборку в корзину
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <a
            key={p.id}
            href={`/catalog/${p.id}`}
            className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
          >
            <Image
              src={p.image}
              alt={p.name}
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMCIgd2lkdGg9IjEwMCI+PC9zdmc+"
            />
            <div className="p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 flex-1">
                  {p.name}
                </h3>
                <div className="text-sm font-semibold">
                  {p.volumes[p.recommendedVolumeIndex].price} {tenge}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Рекомендуемый объем:{" "}
                {p.volumes[p.recommendedVolumeIndex].volume}
              </div>
            </div>
          </a>
        ))}
      </div>

      {toast && (
        <div className="fixed right-4 bottom-6 z-50">
          <div className="bg-black text-white px-4 py-2 rounded shadow">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
