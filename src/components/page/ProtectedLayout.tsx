"use client";

import useAuth from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Page = "signin" | "profile";

export default function ProtectedLayout({ children, page }: { children: React.ReactNode; page: Page }) {
  const currentUser = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (page === "signin" && currentUser) {
      router.back();
      return;
    } else if (page === "profile" && !currentUser) {
      router.push("/signin");
      return;
    }
  }, [page, currentUser, router]);

  if ((page === "signin" && !currentUser) || (page === "profile" && currentUser)) return <>{children}</>;
}
