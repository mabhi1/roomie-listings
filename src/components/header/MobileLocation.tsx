"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cityList } from "@/lib/NJStateInfo";
import { Button } from "../ui/button";
import { Check, MapPinIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import useAuth from "../providers/AuthProvider";
import { cn } from "@/lib/utils";

export default function MobileLocation() {
  const { currentCity, setCurrentCity } = useAuth();
  const [open, setOpen] = useState(false);
  const [popMessage, setPopMessage] = useState(true);

  return (
    <Drawer>
      <DrawerTrigger>
        <Popover open={popMessage} onOpenChange={setPopMessage}>
          <PopoverTrigger asChild>
            <MapPinIcon className="w-5" />
          </PopoverTrigger>
          <PopoverContent className="w-full text-xs md:hidden md:text-sm">
            Your current location is set to {currentCity}, NJ.
          </PopoverContent>
        </Popover>
      </DrawerTrigger>
      <DrawerContent className="p-5 pb-10">
        <DrawerHeader>
          <DrawerTitle>Your current location is set to {currentCity}, NJ.</DrawerTitle>
          <DrawerDescription>Change it to your current location for personalized recommendations.</DrawerDescription>
        </DrawerHeader>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button>Change</Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search city..." />
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup className="h-40 w-full overflow-auto">
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
      </DrawerContent>
    </Drawer>
  );
}
