"use client";

import { Check, MapPin, NavigationIcon } from "lucide-react";
import useAuth from "../providers/AuthProvider";
import { useEffect, useState } from "react";
import { cityList } from "@/lib/NJStateInfo";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { cn } from "@/lib/utils";

export default function HeaderMessage() {
  const { currentCity, setCurrentCity } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [currentCity]);

  return (
    <div className="text-xs bg-secondary">
      <div className="w-full max-w-screen-xl mx-auto px-5 md:px-10 xl:px-5 py-1 flex justify-center flex-wrap items-center gap-1">
        <MapPin className="w-3.5 hidden md:block" />
        <div className="hidden md:block">
          Your current Location is set to{" "}
          <span className="bg-primary/70 text-primary-foreground px-1 rounded">{currentCity}</span>, NJ.
        </div>
        <div className="block md:hidden">
          Current Location : <span className="bg-primary/70 text-primary-foreground px-1 rounded">{currentCity}</span>,
          NJ.
        </div>
        <NavigationIcon className="w-3.5 hidden md:block" />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div>
              <div className="cursor-pointer hidden lg:block">
                Click here to change your current location for personalized recommendations.
              </div>
              <div className="cursor-pointer block lg:hidden">Change here.</div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search city..." />
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup className="h-80 overflow-auto w-full">
                {cityList.map((city) => (
                  <CommandItem
                    key={city}
                    value={city}
                    onSelect={(currentValue) => {
                      setCurrentCity(currentValue.toUpperCase());
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", currentCity === city ? "opacity-100" : "opacity-0")} />
                    {city}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <MapPin className="w-3.5 hidden md:block" />
      </div>
    </div>
  );
}
