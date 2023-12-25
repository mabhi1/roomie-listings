import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import HeaderMessage from "@/components/HeaderMessage";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const nunito = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aakash",
  description: "Connecting together with Aakash",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <HeaderMessage />
        <Header />
        <main className="min-h-[80vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
