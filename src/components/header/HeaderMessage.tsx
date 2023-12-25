import { RadioTower } from "lucide-react";

const HeaderMessage = () => {
  return (
    <div className="flex justify-center items-center gap-2 p-1 text-sm bg-secondary">
      <RadioTower className="w-4" />
      Currently live in New Jersey, US
    </div>
  );
};

export default HeaderMessage;
