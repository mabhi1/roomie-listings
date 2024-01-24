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
    <FullWrapper className="py-5 md:py-10 lg:py-18 xl:py-24 gap-5 md:gap-10 items-center">
      <h1 className={cn("text-xl md:text-2xl xl:text-3xl flex gap-2", raleway.className)}>
        <span className="uppercase">Welcome to</span>
        <span className="uppercase bg-primary rounded px-1 text-accent">{title.site}</span>
      </h1>
      <div className="text-2xl md:text-4xl xl:text-7xl leading-tight text-center">
        You are at the right place to look for a roommate, rent a house, or buy, rent, and sell stuff.
      </div>
      <span className="text-lg md:text-xl xl:text-2xl text-center">
        Click one of the buttons below to continue browsing
      </span>
      <div className="flex justify-between gap-2 md:gap-5">
        <Link href={navigation.roommate} legacyBehavior passHref>
          <Button>
            <UsersIcon className="w-4 mr-1" />
            {title.roommate}
          </Button>
        </Link>
        <Link href={navigation.house} legacyBehavior passHref>
          <Button>
            <HotelIcon className="w-4 mr-1" />
            {title.house}
          </Button>
        </Link>
        <Link href="#" legacyBehavior passHref>
          <Button>
            <BedDoubleIcon className="w-4 mr-1" />
            {title.products}
          </Button>
        </Link>
      </div>
    </FullWrapper>
  );
}
