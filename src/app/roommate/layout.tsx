import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roommate Search",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
