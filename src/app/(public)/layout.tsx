// components
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

interface PublicRootLayoutProps {
  children: React.ReactNode;
}

export default function PublicRootLayout({ children }: PublicRootLayoutProps) {
  return (
    <div className="hide-scrollbar relative flex max-w-175 min-w-75 flex-1 flex-col overflow-scroll md:rounded-lg md:shadow-xl">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
