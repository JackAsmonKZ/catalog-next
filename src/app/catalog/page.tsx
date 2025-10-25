"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { products as initialProducts } from "../../types/products";
import { categories } from "../../types/categories";
import { tenge } from "@/constants/constants";
import { getMinPrice, shortDesc } from "@/lib/utils";
import { Product } from "@/types/types";
import { ArrowRight } from "lucide-react";

export default function CatalogPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("catalog_selected_categories");
      if (raw) {
        setSelectedCategories(JSON.parse(raw));
      }
    } catch {}
    try {
      const rawFav = localStorage.getItem("catalog_show_favorites");
      if (rawFav) {
        setShowFavoritesOnly(JSON.parse(rawFav));
      }
    } catch {}
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resp = await fetch("/api/products");
        const data = await resp.json();
        if (data) {
          setProducts(data);
        }
      } catch {
        setProducts(initialProducts);
      }
    };
    fetchProducts();
  }, []);

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

  useEffect(() => {
    try {
      localStorage.setItem(
        "catalog_show_favorites",
        JSON.stringify(showFavoritesOnly)
      );
    } catch {}
  }, [showFavoritesOnly]);

  const categoriesWithAll = useMemo(() => categories, []);

  const toggleLike = async (product: Product) => {
    setProducts([
      ...products.map((p) =>
        p.id === product.id ? { ...p, isLiked: !product.isLiked } : p
      ),
    ]);
  };

  const saveSelectedCategories = (cats: string[]) => {
    setSelectedCategories(cats);
    try {
      localStorage.setItem("catalog_selected_categories", JSON.stringify(cats));
    } catch {}
  };

  const clearSelectedCategories = () => {
    setSelectedCategories([]);
    try {
      localStorage.removeItem("catalog_selected_categories");
    } catch {}
  };

  const productMatchesCategories = (product: Product, cats: string[]) => {
    if (cats.length === 0) return true;
    const prodCats: string[] = [];
    if ((product as any).category)
      prodCats.push(String((product as any).category));
    if ((product as any).categoryId)
      prodCats.push(String((product as any).categoryId));
    if (
      (product as any).categoryIds &&
      Array.isArray((product as any).categoryIds)
    ) {
      prodCats.push(...(product as any).categoryIds.map((c: any) => String(c)));
    }
    if (
      (product as any).categories &&
      Array.isArray((product as any).categories)
    ) {
      prodCats.push(...(product as any).categories.map((c: any) => String(c)));
    }
    for (const c of prodCats) {
      if (cats.includes(c)) return true;
    }
    return false;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (showFavoritesOnly && !p.isLiked) return false;
      if (!productMatchesCategories(p, selectedCategories)) return false;
      return true;
    });
  }, [products, showFavoritesOnly, selectedCategories]);

  return (
    <main className="py-4 sm:p-6 lg:p-10">
      <section className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 pl-[10px]">Каталог</h1>

        <div className="flex flex-col gap-3 items-start mb-6 pl-[10px] pr-[10px]">
          <div ref={wrapperRef} className="relative w-full">
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
                        checked={selectedCategories.includes(String(cat.id))}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const catId = String(cat.id);
                          saveSelectedCategories(
                            checked
                              ? Array.from(
                                  new Set([...selectedCategories, catId])
                                )
                              : selectedCategories.filter((c) => c !== catId)
                          );
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
                      clearSelectedCategories();
                      setOpen(false);
                    }}
                    className="text-sm text-gray-600"
                  >
                    Сбросить
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-sm bg-[#C2A389] text-white px-3 py-1 rounded-md"
                  >
                    Готово
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className={`px-2 py-1 rounded-md border transition-colors duration-150 ${
                !showFavoritesOnly
                  ? "bg-[#C2A389] text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setShowFavoritesOnly(true)}
              className={`px-2 py-1 rounded-md border transition-colors duration-150 ${
                showFavoritesOnly
                  ? "bg-[#C2A389] text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Избранные
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-[10px] gap-y-[20px] px-[5px] w-full max-w-[1200px]">
            {filteredProducts.map((product) => {
              const isLiked = product.isLiked;
              return (
                <article
                  key={product.id}
                  onClick={() => router.push(`/catalog/${product.id}`)}
                  className="rounded-[30px] bg-[#e0e0e0] shadow-[7px_7px_15px_#bebebe,-7px_-7px_15px_#ffffff] overflow-hidden cursor-pointer transition-shadow duration-200 flex flex-col"
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
                        toggleLike(product);
                      }}
                      aria-label="like"
                      className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors duration-150 flex items-center justify-center ${
                        isLiked
                          ? "bg-red-100 text-red-50"
                          : "bg-white text-gray-500"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`w-5 h-5 ${
                          isLiked ? "text-red-400" : "text-gray-400"
                        }`}
                      >
                        <path d="M12 21s-7.5-4.35-10-7.5C-0.5 9 4 4 8.5 6.5 11 8 12 10 12 10s1-2 3.5-3.5C20 4 24.5 9 22 13.5 19.5 16.65 12 21 12 21z" />
                      </svg>
                    </button>
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
                </article>
              );
            })}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-12">
                Нет товаров для отображения
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
