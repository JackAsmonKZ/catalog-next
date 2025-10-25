import Link from "next/link";
import { collections } from "../../../src/types/collections";
import { products } from "../../../src/types/products";
import { tenge } from "@/constants/constants";

export default function CollectionsPage() {
  const rows = collections.map((col) => {
    const items = col.productIds || [];
    const count = items.length;
    const total = items.reduce((sum, it) => {
      const p = products.find((pp) => pp.id === it.productId);
      if (!p) return sum;
      const vol = p.volumes?.[it.recommendedVolumeIndex];
      return sum + (vol?.price || 0);
    }, 0);

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      count,
      total,
    };
  });

  return (
    <main className="p-2 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Подборки</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rows.map((r) => (
          <Link
            key={r.id}
            href={`/collections/${r.id}`}
            className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-lg font-medium">{r.name}</h2>
                <p className="text-sm text-gray-500 mt-2">{r.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">Товаров: {r.count}</div>
                <div className="text-sm font-semibold">
                  {r.total} {tenge}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
