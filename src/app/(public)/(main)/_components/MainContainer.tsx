// components
import ProfileSection from "./ProfileSection";
import ProductSection from "./ProductSection";
import VisitorLogger from "@/components/common/VisitorLogger";

export default function MainContainer() {
  return (
    // 메인 컨텐츠
    <main className="gap-md font-ko text-foreground-main flex flex-col">
      {/* 조회수 기록 */}
      <VisitorLogger />
      {/* 프로필 */}
      <ProfileSection />
      {/* 광고제품 리스트 */}
      <ProductSection />
    </main>
  );
}
