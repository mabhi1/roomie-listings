"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HotelIcon, MenuIcon, SearchCheckIcon, UsersIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { useState } from "react";

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden">
        <MenuIcon className="w-5" />
      </SheetTrigger>
      <SheetContent className="md:hidden">
        <div className="text-center font-medium">Menu</div>
        <Accordion type="single" collapsible className="border-t mt-2">
          <AccordionItem value="browse">
            <AccordionTrigger className="py-2 text-xs">
              <div className="flex gap-2 items-center">
                <SearchCheckIcon className="w-4" />
                Browse Ads
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-5 mt-3">
              <Link href="/roommate" className="py-0 text-xs" onClick={() => setOpen(false)}>
                <div className="flex gap-2 items-center">
                  <UsersIcon className="w-4" />
                  Search Roommate
                </div>
              </Link>
              <Link href="/roommate" className="py-0 text-xs" onClick={() => setOpen(false)}>
                <div className="flex gap-2 items-center">
                  <HotelIcon className="w-4" />
                  Search House
                </div>
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}
