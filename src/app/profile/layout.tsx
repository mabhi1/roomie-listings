import ProtectedLayout from "@/components/page/ProtectedLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout page="profile">{children}</ProtectedLayout>;
}
