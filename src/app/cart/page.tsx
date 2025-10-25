"use client";

import { useEffect, useMemo, useState } from "react";
import { products as allProducts } from "../../../src/types/products";
import { tenge } from "@/constants/constants";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type CartItem = { productId: string; volumeIndex: number; quantity: number };

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("catalog_cart");
      setCart(raw ? JSON.parse(raw) : []);
    } catch (e) {
      setCart([]);
    }
  }, []);

  const save = (next: CartItem[]) => {
    setCart(next);
    try {
      localStorage.setItem("catalog_cart", JSON.stringify(next));
      try {
        window.dispatchEvent(new Event("cart_updated"));
      } catch (e) {
        // ignore
      }
    } catch (e) {
      // ignore
    }
  };

  const items = useMemo(() => {
    return cart
      .map((it) => {
        const p = allProducts.find((ap) => ap.id === it.productId);
        if (!p) return null;
        const volume = p.volumes[it.volumeIndex];
        return {
          ...it,
          product: p,
          volume,
        } as unknown as {
          productId: string;
          volumeIndex: number;
          quantity: number;
          product: typeof p;
          volume: { volume: string; price: number };
        };
      })
      .filter(Boolean) as any[];
  }, [cart]);

  const total = useMemo(() => {
    return items.reduce((s, it) => s + it.volume.price * it.quantity, 0);
  }, [items]);

  const changeQty = (index: number, qty: number) => {
    const next = [...cart];
    next[index] = { ...next[index], quantity: Math.max(1, qty) };
    save(next);
  };

  const remove = (index: number) => {
    const next = [...cart];
    next.splice(index, 1);
    save(next);
    try {
      window.dispatchEvent(
        new CustomEvent("show_toast", {
          detail: { message: "Товар удалён из корзины" },
        })
      );
    } catch (e) {}
  };

  const generateWhatsAppLink = () => {
    const phone = "77471658747";
    const lines = items.map(
      (it) =>
        `${it.product.name} (${it.volume.volume}) x ${it.quantity} = ${
          it.volume.price * it.quantity
        } ${tenge}`
    );
    const text =
      `Здравствуйте! Хочу оформить заказ:\n\n` +
      lines.join("\n") +
      `\n\nИтого: ${total} ${tenge}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  if (cart.length === 0) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">Ваша корзина пуста</h2>
          <p className="text-sm text-gray-500 mt-2">
            Добавьте товары из каталога
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push("/catalog")}
              className="px-4 py-2 bg-[#C2A389] text-white rounded-md"
            >
              Перейти в каталог
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-2 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Корзина</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((it, idx) => (
            <div
              key={`${it.productId}-${it.volumeIndex}`}
              className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="flex-1 flex gap-[10px]">
                <Link
                  href={`/catalog/${it.productId}`}
                  className="text-sm font-medium hover:underline cursor-pointer h-fit"
                >
                  <Image
                    src={it.product.image}
                    alt={it.product.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMCIgd2lkdGg9IjEwMCI+PC9zdmc+"
                  />
                </Link>
                <div className="w-full">
                  <Link
                    href={`/catalog/${it.productId}`}
                    className="text-sm font-medium hover:underline cursor-pointer h-fit"
                  >
                    {it.product.name}
                  </Link>
                  <div className="text-xs text-gray-500">
                    {it.volume.volume}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm font-semibold">
                      {it.volume.price} {tenge}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changeQty(idx, it.quantity - 1)}
                        className={`px-2 py-1 border rounded ${
                          it.quantity <= 1 && "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={it.quantity <= 1}
                      >
                        -
                      </button>
                      <div className="px-3 mx-[5px] w-12 text-center">
                        {it.quantity}
                      </div>
                      <button
                        onClick={() => changeQty(idx, it.quantity + 1)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(idx)}
                      className="text-sm text-red-600 mt-[10px]"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Итого</div>
            <div className="text-xl font-bold">
              {total} {tenge}
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                const url = generateWhatsAppLink();
                window.open(url, "_blank");
              }}
              className="w-full px-4 py-2 bg-[#C2A389] text-white rounded-md"
            >
              Оформить заказ
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
