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
      className="px-lg flex w-full flex-row items-center overflow-hidden rounded-xl bg-white transition duration-100 hover:shadow-lg active:scale-105"
    >
      {/* 이미지 컨테이너 */}
      <div className="relative h-20 w-20 min-w-20 shrink-0">
        <Image
          src={image}
          alt="제품 소개 이미지"
          fill
          className="rounded-md object-cover"
          sizes="(max-width: 768px) 80px, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* 제품 정보 TODO: 제품 정보에 따른 크기 변동으로 인해 스타일 오류(line-clamp-2)*/}
      <div className="flex-1 p-4">
        <h3 className="mb-2 text-lg font-bold text-gray-800">{title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
