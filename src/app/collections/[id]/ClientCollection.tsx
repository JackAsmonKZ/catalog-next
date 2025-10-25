"use client";

import React, { useState } from "react";
import type { Collection, Product } from "../../../types/types";
import Image from "next/image";
import { tenge } from "@/constants/constants";
import router from "next/router";
import { getMinPrice, shortDesc, toggleLike } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
      <div className="bg-white p-2 mx-[10px] mb-[10px] rounded-lg shadow-sm">
        <div className="flex items-center justify-center flex-wrap gap-[10px] pb-[15px]">
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
              className="mt-3 px-4 py-2 bg-[#C2A389] text-white rounded-md"
            >
              Добавить всю подборку в корзину
            </button>
          </div>
        </div>
      </div>

      <div className="grid mt-[6px] grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-[10px] gap-y-[20px] px-[5px] w-full max-w-[1200px]">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/catalog/${product.id}`}
            className="max-w-[190px] rounded-[30px] bg-[#e0e0e0] shadow-[7px_7px_15px_#bebebe,-7px_-7px_15px_#ffffff] overflow-hidden cursor-pointer transition-shadow duration-200 flex flex-col"
          >
            <div className="relative">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={400}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMCIgd2lkdGg9IjEwMCI+PC9zdmc+"
              />
            </div>

            <div className="px-[10px] pt-[10px] pb-[15px] flex flex-col gap-3 justify-between flex-1">
              <div>
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {shortDesc(product.description, 95)}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2 px-[5px]">
                <div className="text-sm font-semibold text-gray-900">
                  {getMinPrice(product.volumes)} {tenge}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/catalog/${product.id}`);
                  }}
                  className="cursor-pointer text-sm text-gray-700 px-3 py-1 rounded-md bg-[#C2A389] hover:bg-[#B0957C] transition-colors duration-150"
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {toast && (
        <div className="fixed right-4 bottom-6 z-50">
          <div className="bg-[#C2A389] text-white px-4 py-2 rounded shadow">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
