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
      className="px-lg flex w-full flex-row items-center overflow-hidden rounded-xl bg-white transition duration-100 hover:shadow-lg active:scale-105 md:flex-col md:items-stretch md:px-0"
    >
      {/* 이미지 컨테이너 */}
      <div className="relative h-20 w-20 min-w-20 shrink-0 md:h-62 md:w-full">
        <Image
          src={image}
          alt="제품 소개 이미지"
          fill
          className="rounded-md object-cover md:rounded-t-xl md:rounded-b-none"
          sizes="(max-width: 768px) 80px, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* 제품 정보 */}
      <div className="flex-1 p-4">
        <h3 className="mb-2 text-lg font-bold text-gray-800 md:text-xl">{title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 md:line-clamp-none md:text-base">
          {description}
        </p>
      </div>
    </Link>
  );
}
