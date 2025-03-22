import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[rgb(29,30,32)] transition-all">
      <Header />
      <main className="flex-grow w-full">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
