import React, { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 flex flex-col">
        {/* Banner Placeholder hoặc nội dung chính sẽ chèn vào đây */}
        {children}
      </main>
      <Footer />
    </div>
  );
};
