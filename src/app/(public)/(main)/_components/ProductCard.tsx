"use client";

// components
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  link: string;
}

export default function ProductCard({ image, title, description, link }: ProductCardProps) {
  return (
    <Link
      href={link}
      className="p-sm gap-lg flex w-full flex-row items-center rounded-lg bg-white shadow-sm transition-all duration-200 hover:scale-[0.98] hover:shadow-lg active:bg-gray-100/20"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-50 md:h-24 md:w-24">
        <Image
          src={image}
          alt={title}
          fill // TODO: 이미지 크기를 부모에서 결정
          className="object-cover"
          sizes="(max-width: 768px) 80px, 96px"
        />
      </div>
      <div className="gap-xs flex h-full min-w-0 flex-1 flex-col">
        <h3 className="text-body-sm md:text-body-lg truncate font-bold text-gray-800">{title}</h3>
        <p className="text-body-xs md:text-body-sm line-clamp-3 text-gray-500">{description}</p>
      </div>
    </Link>
  );
}
