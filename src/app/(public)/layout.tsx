// components
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PixelBackground from "@/components/common/PixelBackground";

interface PublicRootLayoutProps {
  children: React.ReactNode;
}

export default function PublicRootLayout({ children }: PublicRootLayoutProps) {
  return (
    <div className="bg-main-gradient hide-scrollbar gap-sm p-md relative flex max-w-175 min-w-78 flex-1 flex-col overflow-scroll md:rounded-lg md:shadow-xl">
      <PixelBackground />
      <Header title={"Creator"} />
      {children}
      <Footer />
    </div>
  );
}
