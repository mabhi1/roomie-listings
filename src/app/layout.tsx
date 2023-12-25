import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import HeaderMessage from "@/components/header/HeaderMessage";
import Footer from "@/components/footer/Footer";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aakash",
  description: "Connecting together with Aakash",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "text-sm")}>
        <HeaderMessage />
        <Header />
        <main className="min-h-[90vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
