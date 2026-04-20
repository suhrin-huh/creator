// components
import ProfileSection from "./ProfileSection";
import ProductSection from "./ProductSection";

export default function MainContainer() {
  return (
    // 메인 컨텐츠
    <main className="gap-md font-ko text-foreground-main flex flex-1 flex-col overflow-x-hidden">
      {/* 프로필 */}
      <ProfileSection />
      {/* 광고제품 리스트 */}
      <ProductSection />
    </main>
  );
}
