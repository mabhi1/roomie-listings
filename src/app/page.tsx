import { Rubik } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FullWrapper from "@/components/page/FullWrapper";
import { BedDoubleIcon, HotelIcon, UsersIcon } from "lucide-react";
import { navigation, title } from "@/lib/constants";

const raleway = Rubik({ subsets: ["latin"] });

export default function Home() {
  return (
    <FullWrapper className="lg:py-18 items-center gap-5 py-5 md:gap-10 md:py-10 xl:py-24">
      <h1 className={cn("flex gap-2 text-xl md:text-2xl xl:text-3xl", raleway.className)}>
        <span className="uppercase">Welcome to</span>
        <span className="rounded bg-primary px-1 uppercase text-accent">{title.site}</span>
      </h1>
      <div className="text-center text-2xl leading-tight md:text-4xl xl:text-7xl">
        You are at the right place to look for a roommate, rent a room, or buy, rent, and sell stuff.
      </div>
      <span className="text-center text-lg md:text-xl xl:text-2xl">
        Click one of the buttons below to continue browsing
      </span>
      <div className="flex justify-between gap-2 md:gap-5">
        <Link href={navigation.roommate} legacyBehavior passHref>
          <Button>
            <UsersIcon className="mr-1 w-4" />
            {title.roommate}
          </Button>
        </Link>
        <Link href={navigation.room} legacyBehavior passHref>
          <Button>
            <HotelIcon className="mr-1 w-4" />
            {title.room}
          </Button>
        </Link>
        <Link href="#" legacyBehavior passHref>
          <Button>
            <BedDoubleIcon className="mr-1 w-4" />
            {title.products}
          </Button>
        </Link>
      </div>
    </FullWrapper>
  );
}
