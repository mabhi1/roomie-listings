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
    if (currentUser?.uid !== pathArr[pathArr.length - 1]) router.push("/profile");
  }, [currentUser, pathname, router, pathArr]);

  if (currentUser?.uid === pathArr[pathArr.length - 1]) return <>{children}</>;
  else return <div className="flex-1"></div>;
}
