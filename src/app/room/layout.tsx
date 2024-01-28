import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Room Search",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
