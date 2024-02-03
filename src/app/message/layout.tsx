"use client";

import useAuth from "@/components/providers/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const pathname = usePathname();
  const pathArr = pathname.split("/");
  const router = useRouter();

  useEffect(() => {
    if (currentUser?.uid !== pathArr[2] || currentUser.uid === pathArr[3]) router.replace("/profile");
  }, [currentUser, pathname, router, pathArr]);

  if (currentUser?.uid === pathArr[2] && currentUser.uid !== pathArr[3]) return <>{children}</>;
}
