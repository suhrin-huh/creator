// components
import Header from "@/components/common/Header";
import ProfileSection from "./ProfileSection";
import SponsorshipSection from "./SponsorshipSection";
import Footer from "@/components/common/Footer";

export default function MainContainer() {
  return (
    <div className="hide-scrollbar relative flex max-w-175 min-w-75 flex-1 flex-col overflow-scroll md:rounded-lg md:shadow-xl">
      <Header />
      {/* 메인 컨텐츠 */}
      <main className="gap-y-xl p-xl flex min-w-87.5 flex-1 flex-col bg-gray-200">
        {/* 프로필 */}
        <ProfileSection />
        {/* 광고제품 리스트 */}
        <SponsorshipSection />
      </main>
      <Footer />
    </div>
  );
}
