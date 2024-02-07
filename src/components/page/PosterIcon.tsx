"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Image from "next/image";
import { User } from "@/lib/types";
import useAuth from "../providers/AuthProvider";
import userImage from "../../../public/user.png";

export default function PosterIcon({ poster }: { poster: User }) {
  const { currentUser } = useAuth();

  function getUserIcon() {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="w-fit overflow-clip rounded-full border">
              <Image
                src={poster.photo ? poster.photo : userImage}
                alt={poster.name!}
                width={60}
                height={60}
                className="h-[50px] w-[50px] object-cover md:h-[60px] md:w-[60px]"
                priority
                placeholder="blur"
                blurDataURL={poster.photo ? poster.photo : ""}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs capitalize">{poster.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!currentUser || currentUser.uid !== poster.uid) return <>{getUserIcon()}</>;
  else return getUserIcon();
}
