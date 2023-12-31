import { RadioTowerIcon } from "lucide-react";
import Image from "next/image";

export default function HeaderMessage() {
  return (
    <div className="flex justify-center items-center gap-2 p-1 text-sm bg-secondary">
      <RadioTowerIcon className="w-4" />
      Connecting with our <Image src="/indian_flag.png" alt="India" width={18} height={18} />
      INDIAN community in US. Currently live in New Jersey. &#128640;
    </div>
  );
}
