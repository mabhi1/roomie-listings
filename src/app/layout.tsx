import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import HeaderMessage from "@/components/header/HeaderMessage";
import Footer from "@/components/footer/Footer";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roomie Listings",
  description: "Connecting together with Roomie Listings",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "text-sm min-h-screen flex flex-col")}>
        <AuthProvider>
          <QueryProvider>
            <HeaderMessage />
            <Header />
            {children}
            <Footer />
          </QueryProvider>
        </AuthProvider>
        <Toaster closeButton richColors position="top-right" />
      </body>
    </html>
  );
}
