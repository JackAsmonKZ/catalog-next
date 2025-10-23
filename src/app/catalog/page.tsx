"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { products as initialProducts } from "../../types/products";
import { categories } from "../../types/categories";
import { tenge } from "@/constants/constants";

// Helper to get minimal price from volumes
const getMinPrice = (volumes: { volume: string; price: number }[]) => {
  if (!volumes || volumes.length === 0) return 0;
  return Math.min(...volumes.map((v) => v.price));
};

export default function CatalogPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Initialize likes from localStorage or from product defaults
  useEffect(() => {
    try {
      const raw = localStorage.getItem("catalog_likes");
      if (raw) {
        setLikedMap(JSON.parse(raw));
        return;
      }
    } catch (e) {
      // ignore
    }

    const defaults: Record<string, boolean> = {};
    initialProducts.forEach((p) => (defaults[p.id] = !!p.isLiked));
    setLikedMap(defaults);
  }, []);

  // Persist likes when changed
  useEffect(() => {
    try {
      localStorage.setItem("catalog_likes", JSON.stringify(likedMap));
    } catch (e) {
      // ignore
    }
  }, [likedMap]);

  // Restore selected categories from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("catalog_selected_categories");
      if (raw) {
        setSelectedCategories(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist selected categories
  useEffect(() => {
    try {
      localStorage.setItem(
        "catalog_selected_categories",
        JSON.stringify(selectedCategories)
      );
    } catch (e) {
      // ignore
    }
  }, [selectedCategories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!open) return;
      const target = e.target as Node | null;
      if (
        wrapperRef.current &&
        target &&
        !wrapperRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const categoriesWithAll = useMemo(() => categories, []);

  const filtered = useMemo(() => {
    if (!selectedCategories || selectedCategories.length === 0)
      return initialProducts;
    return initialProducts.filter((p) =>
      selectedCategories.includes(p.categoryId)
    );
  }, [selectedCategories]);

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const shortDesc = (text: string, max = 120) => {
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + "…";
  };

  return (
    <main className="p-4 sm:p-6 lg:p-10">
      <section className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Каталог</h1>

        {/* Categories multi-select */}
        <div ref={wrapperRef} className="relative mb-6">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full text-left px-4 py-2 border rounded-md bg-white flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Категории</span>
              {selectedCategories.length > 0 && (
                <span className="text-xs text-gray-500">
                  {selectedCategories.length} выбрано
                </span>
              )}
            </div>
            <div className="text-sm">▾</div>
          </button>

          {open && (
            <div className="absolute z-30 mt-2 w-full bg-white border rounded-md shadow-md p-3">
              <div className="flex flex-col gap-2 max-h-60 overflow-auto">
                {categoriesWithAll.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedCategories((prev) => {
                          if (checked) return [...prev, cat.id];
                          return prev.filter((c) => c !== cat.id);
                        });
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{cat.name}</span>
                  </label>
                ))}
              </div>

              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setOpen(false);
                  }}
                  className="text-sm text-gray-600"
                >
                  Сбросить
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm bg-black text-white px-3 py-1 rounded-md"
                >
                  Готово
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <article
              key={product.id}
              onClick={() => router.push(`/catalog/${product.id}`)}
              className="group bg-white shadow-sm rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200 flex flex-col"
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

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(product.id);
                  }}
                  aria-label="like"
                  className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors duration-150 flex items-center justify-center ${
                    likedMap[product.id]
                      ? "bg-red-100 text-red-600"
                      : "bg-white text-gray-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-5 h-5 ${
                      likedMap[product.id] ? "text-red-600" : "text-gray-400"
                    }`}
                  >
                    <path d="M12 21s-7.5-4.35-10-7.5C-0.5 9 4 4 8.5 6.5 11 8 12 10 12 10s1-2 3.5-3.5C20 4 24.5 9 22 13.5 19.5 16.65 12 21 12 21z" />
                  </svg>
                </button>
              </div>

              <div className="p-4 flex flex-col gap-3 justify-between flex-1">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {shortDesc(product.description, 95)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm font-semibold text-gray-900">
                    {getMinPrice(product.volumes)} {tenge}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/catalog/${product.id}`);
                    }}
                    className="text-sm text-gray-700 px-3 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-150"
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
