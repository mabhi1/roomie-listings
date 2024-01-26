"use client";

import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import leftSignImage from "../../../public/left-sign.png";

export default function BackButton() {
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Image
            alt="go back"
            src={leftSignImage}
            width={20}
            height={20}
            priority
            className="w-5 md:w-auto cursor-pointer"
            onClick={() => router.back()}
            placeholder="blur"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to go back</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
