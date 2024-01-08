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
import { BedDoubleIcon, HotelIcon, SearchCheckIcon, UsersIcon } from "lucide-react";
import ProtectedNavigation from "./ProtectedNavigation";

const browseAdComponents: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Search Roommate",
    href: "/roommate",
    description: "Find your perfect roommate match with just a click. Your ideal living companion awaits!",
    icon: <UsersIcon className="w-4 mr-1" />,
  },
  {
    title: "Search House",
    href: "/house",
    description: "Discover your dream rental home effortlessly. Choose, and move into your sanctuary!",
    icon: <HotelIcon className="w-4 mr-1" />,
  },
  {
    title: "Search Products",
    href: "#",
    description: "Explore a world of possibilities. Hunt for new or used treasures posted by fellow users!",
    icon: <BedDoubleIcon className="w-4 mr-1" />,
  },
];

const linkStyle =
  '"group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"';

export default function WebNavigation() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <SearchCheckIcon className="w-4 mr-1" />
            Browse Ads
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[290px] gap-3 p-2">
              {browseAdComponents.map((component) => (
                <Link key={component.title} href={component.href}>
                  <div
                    className={cn(
                      "block select-none space-y-1 p-2 py-4 rounded-md leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
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
              className
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
  }
);
ListItem.displayName = "ListItem";
