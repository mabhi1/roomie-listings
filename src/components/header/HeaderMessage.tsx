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
    <div className="hidden bg-secondary text-xs md:block">
      <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-center gap-1 px-5 py-2 md:px-10 md:py-1 xl:px-5">
        <MapPin className="hidden w-3.5 md:block" />
        <div className="hidden md:block">
          Your current Location is set to{" "}
          <span className="rounded bg-primary/70 px-1 text-primary-foreground">{currentCity}</span>, NJ.
        </div>
        <div className="block md:hidden">
          Current Location : <span className="rounded bg-primary/70 px-1 text-primary-foreground">{currentCity}</span>,
          NJ.
        </div>
        <NavigationIcon className="hidden w-3.5 md:block" />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div>
              <div className="hidden cursor-pointer lg:block">
                Click here to change your current location for personalized recommendations.
              </div>
              <div className="block cursor-pointer lg:hidden">Click here to change.</div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search city..." />
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup className="h-80 w-full overflow-auto">
                {cityList.map(city => (
                  <CommandItem
                    key={city}
                    value={city}
                    onSelect={currentValue => {
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
        <MapPin className="hidden w-3.5 md:block" />
      </div>
    </div>
  );
}
