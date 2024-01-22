import { cn } from "@/lib/utils";
import BackButton from "../buttons/BackButton";

export default function PageHeader({
  heading,
  subHeading,
  className,
  backButton = true,
}: {
  heading: string;
  subHeading?: string;
  className?: string;
  backButton?: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-1 items-center">
        {backButton && <BackButton />}
        <h1 className={cn("text-3xl font-light", className)}>{heading}</h1>
      </div>
      {subHeading && <h2>{subHeading}</h2>}
    </div>
  );
}
