"use client";

// library
import { ChangeEvent, useState, useEffect, useTransition, useMemo } from "react";

// hooks
import useDebounce from "@/hooks/useDebounce";

// components

import SearchInput from "./SearchInput";
import SponsorshipList from "./SponsorshipList";

// actions
import { getPublicSponsorships } from "@/actions/sponsorship";

// types
import { PublicSponsorship } from "@/types";

const DEBOUNCE_DELAY = 200;

export default function SponsorshipSection() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, DEBOUNCE_DELAY);

  // 파생 상태로 리스트 관리
  const [sponsorships, setSponsorships] = useState<PublicSponsorship[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // TODO: startTransition을 사용 => UI 블로킹 없이 부드럽게 상태 업데이트 가능
    startTransition(async () => {
      const data = await getPublicSponsorships();
      setSponsorships(data);
    });
  }, []);

  // 원본과 검색어 이용해 재렌더링시마다 계산

  const filteredList = useMemo(() => {
    if (!debouncedKeyword) return sponsorships; // 검색어 없으면 전체 보여줌

    return sponsorships.filter((product) =>
      product.title.toLowerCase().includes(debouncedKeyword.toLowerCase()),
    );
  }, [sponsorships, debouncedKeyword]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <section className="gap-y-lg flex flex-col items-center">
      <SearchInput value={keyword} onChange={handleChange} onClick={handleClear} />
      {/* TODO: 로딩 중 UI 추가 */}
      <SponsorshipList sponsorshipList={filteredList} />
    </section>
  );
}
