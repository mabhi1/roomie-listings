import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental Ads",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
