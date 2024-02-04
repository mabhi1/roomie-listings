import { cn } from "@/lib/utils";
import BackButton from "../buttons/BackButton";
import Link from "next/link";
import { Button } from "../ui/button";

export default function PageHeader({
  heading,
  subHeading,
  className,
  backButton = true,
  action,
  element,
  mobileHeading,
}: {
  heading: string;
  subHeading?: string;
  className?: string;
  backButton?: boolean;
  action?: { link: string; text: string; icon: React.ReactNode };
  element?: React.ReactNode;
  mobileHeading?: string;
}) {
  return (
    <div className="mt-2 flex items-end justify-between md:mt-0">
      <div className="flex w-fit flex-col">
        <div className="flex items-center gap-1">
          {backButton && <BackButton />}
          <h1
            className={cn(
              "w-80 overflow-hidden text-ellipsis text-nowrap text-lg uppercase md:w-auto md:text-xl lg:text-2xl",
              className,
            )}
          >
            <span className="md:hidden">{mobileHeading ? mobileHeading : heading}</span>
            <span className="hidden md:inline">{heading}</span>
          </h1>
        </div>
        {subHeading && <div className="hidden md:block">{subHeading}</div>}
      </div>
      {element ? (
        <span className="hidden md:inline">{element}</span>
      ) : (
        action && (
          <Link href={action.link} passHref legacyBehavior>
            <Button variant="secondary" className="hidden uppercase lg:inline-flex">
              {action.icon}
              {action.text}
            </Button>
          </Link>
        )
      )}
    </div>
  );
}
