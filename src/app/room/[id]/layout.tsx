"use client";

import LoginRequest from "@/components/page/LoginRequest";
import useAuth from "@/components/providers/AuthProvider";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const pathname = usePathname();

  if (currentUser) return <>{children}</>;
  else return <LoginRequest message="Please login to view an Ad." fallbackUrl={pathname} />;
}
