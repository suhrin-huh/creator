import { Suspense } from "react";

import SponsorshipListContent from "./_components/SponsorshipListContent";

export default function SponsorshipPage() {
  return (
    // Suspense를 활용해 Next.js 빌드 시 useSearchParams 에러를 방지
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
          <p>목록을 불러오는 중입니다.</p>
        </div>
      }
    >
      <SponsorshipListContent />
    </Suspense>
  );
}
