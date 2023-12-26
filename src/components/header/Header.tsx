import Image from "next/image";
import WebNavigation from "../navigation/WebNavigation";
import StickyWrapper from "./StickyWrapper";

export default function Header() {
  return (
    <StickyWrapper>
      <div className="flex p-2 w-full max-w-screen-xl mx-auto items-center justify-between">
        <div className="flex gap-3 items-center">
          <Image src="/logo.png" alt="Aakash" width={30} height={30} priority />
          <span className="text-base">Aakash</span>
        </div>
        <WebNavigation />
      </div>
    </StickyWrapper>
  );
}
