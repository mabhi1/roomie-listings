import { cn } from "@/lib/utils";

export default function FullWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return <main className={cn("flex-1 flex flex-col w-full max-w-screen-xl mx-auto mt-5", className)}>{children}</main>;
}
