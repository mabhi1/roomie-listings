import Image from "next/image";
import WebNavigation from "../navigation/WebNavigation";
import StickyWrapper from "./StickyWrapper";
import { title } from "@/lib/constants";
import Link from "next/link";

export default function Header() {
  return (
    <StickyWrapper>
      <div className="flex px-10 xl:px-5 py-2 w-full max-w-screen-xl mx-auto items-center justify-between">
        <Link href="/" className="flex gap-3 items-center">
          <Image src="/logo.png" alt={title.site} width={30} height={30} priority />
          <span className="text-base">{title.site}</span>
        </Link>
        <WebNavigation />
      </div>
    </StickyWrapper>
  );
}
