import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"], // Hỗ trợ tiếng Việt hoàn hảo
});

export const metadata: Metadata = {
  title: "Nông Sản Sạch | E-Commerce",
  description: "Website thương mại điện tử nông sản sạch, chất lượng cao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: "bg-white/80 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl text-gray-900 font-sans"
          }}
        />
      </body>
    </html>
  );
}
