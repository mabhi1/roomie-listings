import { cn } from "@/lib/utils";

export default function FullWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <main className={cn("mx-auto flex w-full max-w-screen-xl flex-1 flex-col px-5 pb-24 md:px-10 xl:px-5", className)}>
      {children}
    </main>
  );
}
