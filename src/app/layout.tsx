import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import HeaderMessage from "@/components/header/HeaderMessage";
import Footer from "@/components/footer/Footer";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roomie Listings",
  description: "Connecting together with Roomie Listings",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "flex min-h-screen flex-col text-xs md:text-sm")}>
        <AuthProvider>
          <QueryProvider>
            <HeaderMessage />
            <Header />
            {children}
            <SpeedInsights />
            <Analytics />
            <Footer />
          </QueryProvider>
        </AuthProvider>
        <Toaster closeButton richColors position="top-right" />
      </body>
    </html>
  );
}
