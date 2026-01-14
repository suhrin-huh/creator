"use client";

// components
import ProductCard from "./ProductCard";

// types
import { Product } from "./ProductSection";

interface ProductListProps {
  productList: Product[];
}

export default function ProductList({ productList }: ProductListProps) {
  return (
    <div className="gap-md grid grid-cols-1" id="productsGrid">
      {productList.map((product) => (
        <ProductCard
          key={`product-card-${product.id}`}
          title={product.title}
          image={product.image}
          description={product.description}
          link={product.link}
        />
      ))}
    </div>
  );
}
