import Image from "next/image";
import WebNavigation from "../navigation/WebNavigation";
import StickyWrapper from "./StickyWrapper";
import { title } from "@/lib/constants";
import Link from "next/link";
import MobileNavigation from "../navigation/MobileNavigation";
import MobileLocation from "./MobileLocation";
import logoImage from "../../../public/logo.png";
import LandingMessage from "../page/LandingMessage";

export default function Header() {
  return (
    <StickyWrapper>
      <div className="mx-auto flex w-full max-w-screen-xl flex-row items-center justify-between px-5 py-4 md:flex-col md:bg-inherit md:px-10 lg:flex-row xl:px-5">
        <Link href="/" className="my-1 flex items-center gap-3 md:my-2 lg:my-0">
          <Image src={logoImage} alt={title.site} width={30} height={30} priority />
          <span className="text-base">{title.site}</span>
        </Link>
        <div className="hidden md:flex">
          <WebNavigation />
        </div>
        <div className="flex gap-3 md:hidden">
          <MobileLocation />
          <MobileNavigation />
        </div>
        <LandingMessage />
      </div>
    </StickyWrapper>
  );
}
