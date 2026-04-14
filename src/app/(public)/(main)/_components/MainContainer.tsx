// components
import ProfileSection from "./ProfileSection";
import ProductSection from "./ProductSection";

export default function MainContainer() {
  return (
    // 메인 컨텐츠
    <main className="gap-y-xl p-xl flex min-w-87.5 flex-1 flex-col bg-gray-200">
      {/* 프로필 */}
      <ProfileSection />
      {/* 광고제품 리스트 */}
      <ProductSection />
    </main>
  );
}
