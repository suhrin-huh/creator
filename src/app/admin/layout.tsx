// components
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

interface AdminRootLayoutProps {
  children: React.ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return (
    <div className="hide-scrollbar relative flex max-w-175 min-w-75 flex-1 flex-col overflow-scroll md:rounded-lg md:shadow-xl">
      <Header title={"Admin"} />
      {children}
      <Footer />
    </div>
  );
}
