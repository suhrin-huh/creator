"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function ProductDetailModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const productId = searchParams.get("productId");

  // 모달 닫기 핸들러
  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("productId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // productId가 없으면 아무것도 렌더링하지 않음
  if (!productId) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
      onClick={handleClose} // 배경(Backdrop) 클릭 시 닫기
    >
      <div className="bg-white p-lg rounded-lg">
        <p>상품 상세 내역</p>
      </div>
    </div>
  );
}