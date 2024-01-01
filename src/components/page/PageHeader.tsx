import { cn } from "@/lib/utils";
import BackButton from "../button/BackButton";

export default function PageHeader({ heading, className }: { heading: string; className?: string }) {
  return (
    <div className="flex gap-1 items-center">
      <BackButton />
      <h1 className={cn("text-3xl font-light", className)}>{heading}</h1>
    </div>
  );
}
