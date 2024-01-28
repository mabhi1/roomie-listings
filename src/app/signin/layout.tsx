"use client";

import useAuth from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) router.replace("/profile");
  }, [currentUser, router]);

  if (!currentUser) return <>{children}</>;
  else return <div className="flex-1"></div>;
}
