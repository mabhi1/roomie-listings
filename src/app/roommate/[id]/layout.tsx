import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roommate Ads",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
