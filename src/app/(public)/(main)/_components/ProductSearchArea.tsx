"use client";

import { ChangeEvent, useState, useMemo } from "react";
import useDebounce from "@/hooks/useDebounce";

import Image from "next/image";
import Link from "next/link";

import { PublicProduct } from "@/types";

const DEBOUNCE_DELAY = 200;

interface ProductSearchAreaSearchAreaProps {
  initialProducts: PublicProduct[]; // 서버에서 받아온 초기 데이터
}

// 픽셀 돋보기 SVG
function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3" y="1" width="6" height="1" fill="#6677aa" />
      <rect x="2" y="2" width="1" height="1" fill="#6677aa" />
      <rect x="9" y="2" width="1" height="1" fill="#6677aa" />
      <rect x="1" y="3" width="1" height="5" fill="#6677aa" />
      <rect x="10" y="3" width="1" height="5" fill="#6677aa" />
      <rect x="2" y="8" width="1" height="1" fill="#6677aa" />
      <rect x="9" y="8" width="1" height="1" fill="#6677aa" />
      <rect x="3" y="9" width="6" height="1" fill="#6677aa" />
      <rect x="3" y="2" width="6" height="1" fill="#b0c0e8" />
      <rect x="2" y="3" width="8" height="5" fill="#b0c0e8" />
      <rect x="3" y="8" width="6" height="1" fill="#b0c0e8" />
      <rect x="3" y="3" width="2" height="1" fill="rgba(255,255,255,0.7)" />
      <rect x="3" y="4" width="1" height="1" fill="rgba(255,255,255,0.5)" />
      <rect x="9" y="9" width="2" height="2" fill="#6677aa" />
      <rect x="10" y="10" width="2" height="2" fill="#6677aa" />
      <rect x="11" y="11" width="2" height="2" fill="#6677aa" />
      <rect x="12" y="12" width="2" height="2" fill="#4a5588" />
    </svg>
  );
}

// 픽셀 X SVG
function ClearIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="2" height="2" fill="#8899cc" />
      <rect x="8" y="0" width="2" height="2" fill="#8899cc" />
      <rect x="2" y="2" width="2" height="2" fill="#8899cc" />
      <rect x="6" y="2" width="2" height="2" fill="#8899cc" />
      <rect x="4" y="4" width="2" height="2" fill="#8899cc" />
      <rect x="2" y="6" width="2" height="2" fill="#8899cc" />
      <rect x="6" y="6" width="2" height="2" fill="#8899cc" />
      <rect x="0" y="8" width="2" height="2" fill="#8899cc" />
      <rect x="8" y="8" width="2" height="2" fill="#8899cc" />
    </svg>
  );
}

export default function ProductSearchAreaSearchArea({
  initialProducts,
}: ProductSearchAreaSearchAreaProps) {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, DEBOUNCE_DELAY);

  // 원본(initialProducts)과 검색어 이용해 렌더링 시마다 계산
  const filteredList = useMemo(() => {
    if (!debouncedKeyword) return initialProducts;

    return initialProducts.filter((product) =>
      product.title.toLowerCase().includes(debouncedKeyword.toLowerCase()),
    );
  }, [initialProducts, debouncedKeyword]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <>
      <div className="flex items-center gap-1.5 p-2.5">
        {/* 돋보기 아이콘 */}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          <SearchIcon />
        </span>
        {/* 검색 입력 */}
        <input
          type="text"
          value={keyword}
          onChange={handleChange}
          placeholder="제품을 검색해보세요."
          className="border-primary font-ko text-foreground-main placeholder:text-foreground-muted focus:border-primary-outlined flex-1 border-2 bg-white px-2.5 py-1.5 text-[13px] outline-none"
          aria-label="제품 검색"
        />

        {/* 클리어 버튼 */}
        <button
          onClick={handleClear}
          className="border-primary bg-primary-light hover:bg-primary-hover/30 flex h-6.5 w-6.5 shrink-0 cursor-pointer items-center justify-center border-2 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8),inset_-1px_-1px_0_rgba(80,100,180,0.15)]"
          aria-label="검색어 지우기"
        >
          <ClearIcon />
        </button>
      </div>
      <div className="divide-outlined-light divide-y">
        {filteredList.length === 0 ? (
          <div className="font-pixel text-foreground-muted text-body-xs py-8 text-center leading-[2.5]">
            ✕ no results found
            <br />
            다른 키워드로 검색해보세요
          </div>
        ) : (
          filteredList.map((product) => (
            <Link
              key={`product-card-${product.id}`}
              href={product.purchaseUrl}
              className="p-sm gap-lg hover:bg-primary-muted active:bg-primary-muted flex w-full flex-row items-center transition-all duration-200"
            >
              <div className="p-sm relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-50 md:h-24 md:w-24">
                {/* TODO: 이미지 대체 아이콘 추가 필요 */}
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80px, 96px"
                />
              </div>
              <div className="gap-xs flex h-full min-w-0 flex-1 flex-col">
                <h3 className="text-body-sm text-foreground-main truncate font-bold">
                  {product.title}
                </h3>
                <p className="text-body-xs text-foreground-muted line-clamp-3">
                  {product.description}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
