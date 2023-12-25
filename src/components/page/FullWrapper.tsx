import { cn } from "@/lib/utils";

export default function FullWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("w-full max-w-screen-xl mx-auto", "mt-5", className)}>{children}</div>;
}
