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
import { BedDoubleIcon, HomeIcon, HotelIcon, SearchCheckIcon, UsersIcon } from "lucide-react";
import SignoutButton from "../button/SignoutButton";
import SigninButton from "../button/SigninButton";

const components: { title: string; href: string; description: string; icon?: React.ReactNode }[] = [
  {
    title: "Roommate",
    href: "/roommate",
    description: "",
    icon: <UsersIcon className="w-4 mr-1" />,
  },
  {
    title: "Property",
    href: "/property",
    description: "",
    icon: <HotelIcon className="w-4 mr-1" />,
  },
  {
    title: "Products",
    href: "/products",
    description: "",
    icon: <BedDoubleIcon className="w-4 mr-1" />,
  },
];
const linkStyle =
  '"group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"';

export function WebNavigation() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={linkStyle}>
              <HomeIcon className="w-4 mr-1" />
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <SearchCheckIcon className="w-4 mr-1" />
            Browse
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[200px] gap-3 p-2">
              {components.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.icon}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <SigninButton />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <SignoutButton />
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
            ref={ref}
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

export default WebNavigation;
