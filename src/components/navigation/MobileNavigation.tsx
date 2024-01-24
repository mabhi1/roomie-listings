"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { KeySquareIcon, MailIcon, MenuIcon, PlusCircleIcon, SearchCheckIcon, SquareUserRoundIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { useState } from "react";
import useAuth from "../providers/AuthProvider";
import SignoutButton from "../buttons/SignoutButton";

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <MenuIcon className="w-5" />
      </SheetTrigger>
      <SheetContent className="p-0">
        <div className="text-lg text-center p-3 bg-secondary">Menu</div>
        <Accordion type="single" collapsible className="border-t">
          <AccordionItem value="browse">
            <AccordionTrigger className="py-2 text-xs px-5">
              <div className="flex gap-2 items-center font-medium">
                <SearchCheckIcon className="w-4" />
                Browse Ads
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-5 mt-2">
              <Link href="/roommate" className="py-0 text-xs ml-6" onClick={() => setOpen(false)}>
                Search Roommate
              </Link>
              <Link href="/house" className="py-0 text-xs ml-6" onClick={() => setOpen(false)}>
                Search House
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {currentUser ? (
          <>
            <Accordion type="single" collapsible>
              <AccordionItem value="browse">
                <AccordionTrigger className="py-2 text-xs px-5">
                  <div className="flex gap-2 items-center font-medium">
                    <PlusCircleIcon className="w-4" />
                    Create Ads
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-5 mt-2">
                  <Link href="/roommate/create" className="py-0 text-xs ml-6" onClick={() => setOpen(false)}>
                    Create Roommate Ad
                  </Link>
                  <Link href="/house/create" className="py-0 text-xs ml-6" onClick={() => setOpen(false)}>
                    Create House Ad
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Link
              href="/profile"
              className="py-2 text-xs flex gap-2 items-center font-medium px-5"
              onClick={() => setOpen(false)}
            >
              <SquareUserRoundIcon className="w-4" />
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/signin"
              className="py-2 text-xs flex gap-2 items-center font-medium px-5"
              onClick={() => setOpen(false)}
            >
              <KeySquareIcon className="w-4" />
              Sign in
            </Link>
          </>
        )}
        <Link
          href="/contact"
          className="py-2 text-xs flex gap-2 items-center font-medium border-t px-5"
          onClick={() => setOpen(false)}
        >
          <MailIcon className="w-4" />
          Contact Us
        </Link>
        {currentUser && (
          <div className="flex px-5">
            <SignoutButton variant="destructive" className="flex-1 mt-1" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
