"use client";

// components
import SponsorshipCard from "./SponsorshipCard";

// types
import { PublicSponsorship } from "@/types";

interface SponsorshipListProps {
  sponsorshipList: PublicSponsorship[];
}

export default function SponsorshipList({ sponsorshipList }: SponsorshipListProps) {
  return (
    <div className="gap-md grid w-full grid-cols-1" id="productsGrid">
      {sponsorshipList.map((sponsorship) => (
        <SponsorshipCard
          key={`product-card-${sponsorship.id}`}
          title={sponsorship.title}
          image={sponsorship.imageUrl}
          description={sponsorship.description}
          link={sponsorship.purchaseUrl}
        />
      ))}
    </div>
  );
}
