"use client";

// library
import { ChangeEvent, useState, useEffect } from "react";

// hooks
import useDebounce from "@/hooks/useDebounce";

// components
import SearchInput from "./SearchInput";
import ProductList from "./ProductList";

const PRODUCT_LIST = [
  {
    id: 0,
    title: "지가드 도난방지 롱스트랩",
    description:
      "견고한 강화 후크로 여행 중 소매치기와 분실 위험을 방지하고, 최대 160cm까지 길이를 조절할 수 있어 나만의 맞춤형 스타일로 편안하게 활용이 가능합니다.",
    image: "/gitis-ggardstrap.jpg",
    link: "https://smartstore.naver.com/gtcare/products/12707065051",
  },
  {
    id: 1,
    title: "샵한현재 소프트 벨벳 립 앤 치크",
    description:
      "립·치크·아이까지, 하나로 완성되는 멀티 톤온톤 컬러, 프라이머 기능이 더해진 블러 스머징으로 은은함부터 선명함까지 무너짐없는 컬러픽싱이 가능합니다.",
    image: "/hanhynjae-lipandcheek.jpg",
    link: "https://smartstore.naver.com/hhjbeauty/products/12913591680",
  },
];

export type Product = (typeof PRODUCT_LIST)[number];

const DEBOUNCE_DELAY = 200;

export default function ProductSection() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, DEBOUNCE_DELAY);
  const [productList, setProductList] = useState(PRODUCT_LIST);

  useEffect(() => {
    setProductList(PRODUCT_LIST.filter((product) => product.title.includes(debouncedKeyword)));
  }, [debouncedKeyword]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <section className="gap-y-lg flex flex-col items-center">
      <SearchInput value={keyword} onChange={handleChange} onClick={handleClear} />
      <ProductList productList={productList} />
    </section>
  );
}
