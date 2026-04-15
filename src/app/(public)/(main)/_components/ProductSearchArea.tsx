"use client";

import { ChangeEvent, useState, useMemo } from "react";
import useDebounce from "@/hooks/useDebounce";

import SearchInput from "./SearchInput";
import ProductList from "./ProductList";

import { PublicProduct } from "@/types";

const DEBOUNCE_DELAY = 200;

interface ProductSearchAreaSearchAreaProps {
  initialProducts: PublicProduct[]; // 서버에서 받아온 초기 데이터
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
      <SearchInput value={keyword} onChange={handleChange} onClick={handleClear} />
      <ProductList productList={filteredList} />
    </>
  );
}
