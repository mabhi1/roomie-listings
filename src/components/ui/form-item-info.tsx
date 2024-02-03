import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export default function FormItemInfo({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>
          <InfoIcon className="h-[18px] w-3" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
