import Image from "next/image";
import WebNavigation from "../navigation/WebNavigation";
import StickyWrapper from "./StickyWrapper";
import { title } from "@/lib/constants";

export default function Header() {
  return (
    <StickyWrapper>
      <div className="flex p-2 w-full max-w-screen-xl mx-auto items-center justify-between">
        <div className="flex gap-3 items-center">
          <Image src="/logo.png" alt={title.site} width={30} height={30} priority />
          <span className="text-base">{title.site}</span>
        </div>
        <WebNavigation />
      </div>
    </StickyWrapper>
  );
}
