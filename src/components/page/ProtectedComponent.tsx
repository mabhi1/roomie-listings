"use client";

import { cn } from "@/lib/utils";
import useAuth from "../providers/AuthProvider";

export default function ProtectedComponent({
  children,
  userMessage,
  className,
}: {
  children: React.ReactNode;
  userMessage?: string;
  className?: string;
}) {
  const { currentUser } = useAuth();
  if (currentUser) return <>{children}</>;
  else return <span className={cn("uppercase", className)}>{userMessage}</span>;
}
