import React from "react";
import { collections } from "../../../../src/types/collections";
import { products as allProducts } from "../../../../src/types/products";
import ClientCollection from "./ClientCollection";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function CollectionPage({ params }: Params) {
  const { id } = await params;
  const collection = collections.find((c) => c.id === id);

  if (!collection) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Подборка не найдена</h1>
      </div>
    );
  }

  // Load products with recommended volume index
  const products = collection.productIds
    .map((ref) => {
      const p = allProducts.find((ap) => ap.id === ref.productId);
      if (!p) return null;
      return { ...p, recommendedVolumeIndex: ref.recommendedVolumeIndex };
    })
    .filter(Boolean) as ((typeof allProducts)[number] & {
    recommendedVolumeIndex: number;
  })[];

  return (
    <div className="p-[10px] max-w-6xl mx-auto">
      <ClientCollection collection={collection} products={products} />
    </div>
  );
}
