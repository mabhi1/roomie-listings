import ProtectedLayout from "@/components/page/ProtectedLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "List House",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout page="protected" message="Please sign in to list a house">
      {children}
    </ProtectedLayout>
  );
}
