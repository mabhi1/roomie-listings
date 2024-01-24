import Image from "next/image";
import WebNavigation from "../navigation/WebNavigation";
import StickyWrapper from "./StickyWrapper";
import { title } from "@/lib/constants";
import Link from "next/link";
import MobileNavigation from "../navigation/MobileNavigation";
import MobileLocation from "./MobileLocation";

export default function Header() {
  return (
    <StickyWrapper>
      <div className="bg-secondary md:bg-inherit flex flex-row md:flex-col lg:flex-row px-5 md:px-10 xl:px-5 py-2 w-full max-w-screen-xl mx-auto items-center justify-between">
        <Link href="/" className="flex gap-3 items-center my-1 md:my-2 lg:my-0">
          <Image src="/logo.png" alt={title.site} width={30} height={30} priority />
          <span className="text-base">{title.site}</span>
        </Link>
        <div className="hidden md:flex">
          <WebNavigation />
        </div>
        <div className="flex md:hidden gap-3">
          <MobileLocation />
          <MobileNavigation />
        </div>
      </div>
    </StickyWrapper>
  );
}
