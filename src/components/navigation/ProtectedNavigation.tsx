"use client";

import Link from "next/link";
import { NavigationMenuLink } from "../ui/navigation-menu";
import { Contact2Icon, KeySquareIcon } from "lucide-react";
import useAuth from "../providers/AuthProvider";
import { NavigationMenuItem } from "../ui/navigation-menu";
import SignoutButton from "../button/SignoutButton";

const linkStyle =
  '"group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"';

export default function ProtectedNavigation() {
  const currentUser = useAuth();
  if (currentUser)
    return (
      <>
        <NavigationMenuItem>
          <Link href="/profile" legacyBehavior passHref>
            <NavigationMenuLink className={linkStyle}>
              <Contact2Icon className="w-4 mr-1" />
              Profile
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <SignoutButton />
      </>
    );
  else
    return (
      <>
        <NavigationMenuItem>
          <Link href="/signin" legacyBehavior passHref>
            <NavigationMenuLink className={linkStyle}>
              <KeySquareIcon className="w-4 mr-1" />
              Sign in
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </>
    );
}
