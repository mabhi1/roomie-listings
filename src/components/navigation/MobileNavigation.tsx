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
        <div className="bg-secondary p-3 text-center text-lg">Menu</div>
        <Accordion type="single" collapsible className="border-t">
          <AccordionItem value="browse">
            <AccordionTrigger className="px-5 py-2 text-xs">
              <div className="flex items-center gap-2 font-medium">
                <SearchCheckIcon className="w-4" />
                Browse Ads
              </div>
            </AccordionTrigger>
            <AccordionContent className="mt-2 flex flex-col gap-5">
              <Link href="/roommate" className="ml-11 py-0 text-xs" onClick={() => setOpen(false)}>
                Search Roommate
              </Link>
              <Link href="/house" className="ml-11 py-0 text-xs" onClick={() => setOpen(false)}>
                Search House
              </Link>
            </AccordionContent>
          </AccordionItem>
          {currentUser && (
            <AccordionItem value="create">
              <AccordionTrigger className="px-5 py-2 text-xs">
                <div className="flex items-center gap-2 font-medium">
                  <PlusCircleIcon className="w-4" />
                  Create Ads
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-2 flex flex-col gap-5">
                <Link href="/roommate/create" className="ml-11 py-0 text-xs" onClick={() => setOpen(false)}>
                  Create Roommate Ad
                </Link>
                <Link href="/house/create" className="ml-11 py-0 text-xs" onClick={() => setOpen(false)}>
                  Create House Ad
                </Link>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
        {currentUser ? (
          <Link
            href="/profile"
            className="flex items-center gap-2 px-5 py-2 text-xs font-medium"
            onClick={() => setOpen(false)}
          >
            <SquareUserRoundIcon className="w-4" />
            Profile
          </Link>
        ) : (
          <Link
            href="/signin"
            className="flex items-center gap-2 px-5 py-2 text-xs font-medium"
            onClick={() => setOpen(false)}
          >
            <KeySquareIcon className="w-4" />
            Sign in
          </Link>
        )}
        <Link
          href="/contact"
          className="flex items-center gap-2 border-t px-5 py-2 text-xs font-medium"
          onClick={() => setOpen(false)}
        >
          <MailIcon className="w-4" />
          Contact Us
        </Link>
        {currentUser && (
          <div className="flex px-5">
            <SignoutButton variant="destructive" className="mt-1 flex-1" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
