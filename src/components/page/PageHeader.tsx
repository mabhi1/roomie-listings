import { cn } from "@/lib/utils";

export default function PageHeader({ heading, className }: { heading: string; className?: string }) {
  return <h1 className={cn("text-3xl font-light", className)}>{heading}</h1>;
}
