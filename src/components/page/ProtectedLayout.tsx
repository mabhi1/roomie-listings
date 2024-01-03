"use client";

import useAuth from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginRequest from "./LoginRequest";

type Page = "signin" | "profile" | "protected";

export default function ProtectedLayout({
  children,
  page,
  message,
}: {
  children: React.ReactNode;
  page: Page;
  message?: string;
}) {
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
  else if (page === "protected" && !currentUser) return <LoginRequest message={message} />;
  else if (page === "protected" && currentUser) return <>{children}</>;
}
