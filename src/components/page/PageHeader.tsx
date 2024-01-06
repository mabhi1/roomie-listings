import { cn } from "@/lib/utils";
import BackButton from "../buttons/BackButton";

export default function PageHeader({
  heading,
  className,
  backButton = true,
}: {
  heading: string;
  className?: string;
  backButton?: boolean;
}) {
  return (
    <div className="flex gap-1 items-center">
      {backButton && <BackButton />}
      <h1 className={cn("text-3xl font-light", className)}>{heading}</h1>
    </div>
  );
}
