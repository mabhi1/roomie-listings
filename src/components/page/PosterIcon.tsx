"use client";

import Link from "next/link";
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
            <div className="rounded-full w-fit overflow-clip">
              <Image
                src={poster.photo ? poster.photo : userImage}
                alt={poster.name!}
                width={60}
                height={60}
                className="w-[50px] h-[50px] object-cover"
                priority
                placeholder="blur"
                blurDataURL={poster.photo ? poster.photo : ""}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{poster.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!currentUser || currentUser.uid !== poster.uid)
    return (
      <Link href={`/user/${poster.uid}`} className="md:hover:scale-110 transition">
        {getUserIcon()}
      </Link>
    );
  else return getUserIcon();
}
