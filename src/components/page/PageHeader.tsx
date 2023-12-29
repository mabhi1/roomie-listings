import { cn } from "@/lib/utils";

export default function PageHeader({ heading, className }: { heading: string; className?: string }) {
  return <div className={cn("text-3xl font-light", className)}>{heading}</div>;
}
