// components
import Header from "@/components/common/Header";
import ProfileSection from "./ProfileSection";
import ProductSection from "./ProductSection";
import Footer from "@/components/common/Footer";

export default function MainContainer() {
  return (
    <>
      <Header />
      {/* 메인 컨텐츠 */}
      <main className="gap-y-xl p-xl bg-primary flex flex-col">
        {/* 프로필 */}
        <ProfileSection />
        {/* 광고제품 리스트 */}
        <ProductSection />
      </main>
      <Footer />
    </>
  );
}
