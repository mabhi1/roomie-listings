import { cn } from "@/lib/utils";

export default function FullWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <main
      className={cn("flex-1 flex flex-col w-full max-w-screen-xl mx-auto px-5 md:px-10 xl:px-5 pt-5 pb-24", className)}
    >
      {children}
    </main>
  );
}
