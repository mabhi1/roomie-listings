import Image from "next/image";
import WebNavigation from "./navigation/WebNavigation";
import StickyWrapper from "./StickyWrapper";

const Header = () => {
  return (
    <StickyWrapper>
      <div className="flex p-2 w-full max-w-screen-xl mx-auto items-center justify-between">
        <div className="flex gap-3 items-center">
          <Image src="/logo.png" alt="Aakash" width={30} height={30} />
          <span className="text-xl">Aakash</span>
        </div>
        <WebNavigation />
      </div>
    </StickyWrapper>
  );
};

export default Header;
