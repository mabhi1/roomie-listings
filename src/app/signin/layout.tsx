"use client";

import useAuth from "@/components/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const fallbackUrl = useSearchParams().get("fallbackUrl");

  useEffect(() => {
    if (currentUser) router.replace(fallbackUrl ? fallbackUrl : "/profile");
  }, [currentUser, router]);

  if (!currentUser) return <>{children}</>;
  else return <div className="flex-1"></div>;
}
