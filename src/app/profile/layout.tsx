"use client";

import useAuth from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentUser = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/signin");
      return;
    }
  }, [currentUser, router]);

  if (currentUser) return <>{children}</>;
}
