// library
import { Suspense } from "react";

// components
import SponsorshipModalContent from "./_components/SponsorshipModalContent";

export default function SponsorshipDetailModal() {
  return (
    // URL 파라미터를 읽어오기 전까지(빌드 시점 포함)는 아무것도 렌더링하지 않음(null)
    <Suspense fallback={null}>{/* <SponsorshipModalContent /> */}</Suspense>
  );
}
