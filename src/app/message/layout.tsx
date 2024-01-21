import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Send Message",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
