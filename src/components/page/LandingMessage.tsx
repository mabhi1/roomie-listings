"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { isMobile } from "react-device-detect";
import { cityList } from "@/lib/NJStateInfo";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import useAuth from "../providers/AuthProvider";

export default function LandingMessage() {
  const [open, setOpen] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const { currentCity, setCurrentCity } = useAuth();

  useEffect(() => {
    const announcementUpdated = sessionStorage.getItem("roomie_listings_announcement");
    if (!announcementUpdated) {
      setOpen(true);
      sessionStorage.setItem("roomie_listings_announcement", "true");
    }
  }, []);

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="p-5 pb-10">
          <DrawerHeader>
            <DrawerTitle>Announcement</DrawerTitle>
            <DrawerDescription>
              <div className="my-3 rounded border bg-muted p-1 px-2">
                Currently live in <span className="font-semibold uppercase text-primary">New Jersey</span> only.
              </div>
              <div>
                Location is set to <span className="font-semibold uppercase text-primary">{currentCity}</span>, change
                it to your current location for personalized recommendations.
              </div>
            </DrawerDescription>
          </DrawerHeader>
          <Popover open={popOpen} onOpenChange={setPopOpen}>
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
                        setPopOpen(false);
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
  else
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-3/4 rounded">
          <DialogHeader className="gap-5">
            <DialogTitle>Announcement</DialogTitle>
            <DialogDescription>
              <div className="mb-5 rounded border bg-muted p-1 px-2">
                Currently live in <span className="font-semibold uppercase text-primary">New Jersey</span> only.
              </div>
              <div className="pl-2">
                Location is set to <span className="font-semibold uppercase text-primary">{currentCity}</span>, change
                it to your current location for personalized recommendations.
              </div>
            </DialogDescription>
          </DialogHeader>
          <Popover open={popOpen} onOpenChange={setPopOpen}>
            <PopoverTrigger asChild>
              <Button>Change</Button>
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
                        setPopOpen(false);
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
        </DialogContent>
      </Dialog>
    );
}
