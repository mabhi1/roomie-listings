"use client";

import Link from "next/link";
import { NavigationMenuContent, NavigationMenuLink, NavigationMenuTrigger } from "../ui/navigation-menu";
import {
  ImagePlusIcon,
  KeySquareIcon,
  PackagePlusIcon,
  PlusCircleIcon,
  SquareUserRoundIcon,
  UserPlusIcon,
} from "lucide-react";
import useAuth from "../providers/AuthProvider";
import { NavigationMenuItem } from "../ui/navigation-menu";
import SignoutButton from "../buttons/SignoutButton";
import { title } from "@/lib/constants";
import { cn } from "@/lib/utils";

const linkStyle =
  '"group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"';

const createAdComponents: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Roommate",
    href: "/roommate/create",
    description: "Craft your roommate ad, be seen, and connect with like-minded cohabitants effortlessly!",
    icon: <UserPlusIcon className="mr-1 w-4" />,
  },
  {
    title: "Room",
    href: "/room/create",
    description: "Showcase your home with a captivating ad. Rent to the perfect tenant easily!",
    icon: <ImagePlusIcon className="mr-1 w-4" />,
  },
  // {
  //   title: "Products",
  //   href: "#",
  //   description: "Craft a compelling product ad, attract buyers, and turn your stuff into someone's treasure!",
  //   icon: <PackagePlusIcon className="mr-1 w-4" />,
  // },
];

export default function ProtectedNavigation() {
  const { currentUser } = useAuth();
  if (currentUser)
    return (
      <>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <PlusCircleIcon className="mr-1 w-4" />
            Create Ads
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[290px] gap-3 p-2">
              {createAdComponents.map(component => (
                <Link key={component.title} href={component.href}>
                  <div
                    className={cn(
                      "block select-none space-y-1 rounded-md p-2 py-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    )}
                  >
                    <div className="flex items-center">
                      {component.icon}
                      <span className="text-sm leading-none">{component.title}</span>
                    </div>
                    <div className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                      {component.description}
                    </div>
                  </div>
                </Link>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/profile" legacyBehavior passHref>
            <NavigationMenuLink className={linkStyle}>
              <SquareUserRoundIcon className="mr-1 w-4" />
              {title.profile}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <SignoutButton variant="ghost" className={linkStyle} />
      </>
    );
  else
    return (
      <>
        <NavigationMenuItem>
          <Link href="/signin" legacyBehavior passHref>
            <NavigationMenuLink className={linkStyle}>
              <KeySquareIcon className="mr-1 w-4" />
              Sign in
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </>
    );
}
