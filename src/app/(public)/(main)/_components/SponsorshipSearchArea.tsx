"use client";

import { ChangeEvent, useState, useMemo } from "react";
import useDebounce from "@/hooks/useDebounce";

import SearchInput from "./SearchInput";
import SponsorshipList from "./SponsorshipList";

import { PublicSponsorship } from "@/types";

const DEBOUNCE_DELAY = 200;

interface SponsorshipSearchAreaProps {
  initialSponsorships: PublicSponsorship[]; // 서버에서 받아온 초기 데이터
}

export default function SponsorshipSearchArea({ initialSponsorships }: SponsorshipSearchAreaProps) {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, DEBOUNCE_DELAY);

  // 원본(initialSponsorships)과 검색어 이용해 렌더링 시마다 계산
  const filteredList = useMemo(() => {
    if (!debouncedKeyword) return initialSponsorships;

    return initialSponsorships.filter((sponsorship) =>
      sponsorship.title.toLowerCase().includes(debouncedKeyword.toLowerCase()),
    );
  }, [initialSponsorships, debouncedKeyword]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <>
      <SearchInput value={keyword} onChange={handleChange} onClick={handleClear} />
      <SponsorshipList sponsorshipList={filteredList} />
    </>
  );
}
