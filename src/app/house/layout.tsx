import { Metadata } from "next";

export const metadata: Metadata = {
  title: "House Search",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
