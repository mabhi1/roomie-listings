"use client";

import LoginRequest from "@/components/page/LoginRequest";
import useAuth from "@/components/providers/AuthProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  if (currentUser) return <>{children}</>;
  else return <LoginRequest message="Please login to post an Ad." />;
}
