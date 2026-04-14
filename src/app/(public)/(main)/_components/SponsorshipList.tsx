"use client";

// components
import SponsorshipCard from "./SponsorshipCard";

// types
import { PublicProduct } from "@/types";

interface SponsorshipListProps {
  productList: PublicProduct[];
}

export default function SponsorshipList({ productList }: SponsorshipListProps) {
  return (
    <div className="gap-md grid w-full grid-cols-1" id="productsGrid">
      {productList.map((product) => (
        <SponsorshipCard
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
