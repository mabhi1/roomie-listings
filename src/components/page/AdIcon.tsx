import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export default function AdIcon({ icon, text, color }: { icon: React.ReactNode; text: string; color?: string }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className={cn("rounded-full border px-1", color ? `border-[${color}]` : "border-muted-foreground")}>
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-muted-foreground capitalize text-muted">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
