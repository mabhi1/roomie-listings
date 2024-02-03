import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { HotelIcon, MailIcon, SearchCheckIcon, UsersIcon } from "lucide-react";
import ProtectedNavigation from "./ProtectedNavigation";

const linkStyle =
  '"group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"';

const browseAdComponents: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Roommate Ads",
    href: "/roommate",
    description: "Find your perfect roommate match with just a click. Your ideal living companion awaits!",
    icon: <UsersIcon className="mr-1 w-4" />,
  },
  {
    title: "Rental Ads",
    href: "/room",
    description: "Discover your dream rental home effortlessly. Choose, and move into your sanctuary!",
    icon: <HotelIcon className="mr-1 w-4" />,
  },
];

export default function WebNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <SearchCheckIcon className="mr-1 w-4" />
            Browse Ads
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[290px] gap-3 p-2">
              {browseAdComponents.map(component => (
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
        <ProtectedNavigation />
        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={linkStyle}>
              <MailIcon className="mr-1 w-4" />
              Contact Us
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            className={cn(
              "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="flex items-center">
              {children}
              <span className="text-sm leading-none">{title}</span>
            </div>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
