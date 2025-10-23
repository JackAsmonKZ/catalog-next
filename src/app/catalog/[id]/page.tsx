import { products } from "../../../../src/types/products";
import { collections as allCollections } from "../../../../src/types/collections";
import ClientProduct from "./ClientProduct";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  console.log("Product ID:", id);
  if (!product) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Товар не найден</h1>
      </div>
    );
  }

  // Find collections that include this product
  const collections = allCollections.filter((col) =>
    col.productIds.some((ref) => ref.productId === id)
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ClientProduct product={product} collections={collections} />
    </div>
  );
}
