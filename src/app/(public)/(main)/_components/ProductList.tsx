"use client";

// components
import ProductCard from "./ProductCard";

// types
import { PublicSponsorship } from "@/types";

interface ProductListProps {
  productList: PublicSponsorship[];
}

export default function ProductList({ productList }: ProductListProps) {
  return (
    <div className="gap-md grid w-full grid-cols-1" id="productsGrid">
      {productList.map((product) => (
        <ProductCard
          key={`product-card-${product.id}`}
          title={product.title}
          image={product.imageUrl}
          description={product.description}
          link={product.purchaseUrl}
        />
      ))}
    </div>
  );
}
