"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon, MoreHorizontal } from "lucide-react";
import { HouseAddress } from "@/lib/types";
import Link from "next/link";
import { savehouse } from "@/actions/house";
import { toast } from "sonner";
import useAuth from "@/components/providers/AuthProvider";

export type HouseColumnsType = {
  id: string;
  title: string;
  address: {
    address1: string | null;
    city: string;
    state: string;
    zip: string;
  };
  price: number;
  postedBy: string;
  savedBy: string[];
  available: Date;
  duration: "temporary" | "permanent";
  updatedAt: Date;
};

function GetCurrentUser() {
  const currentUser = useAuth();
  return currentUser;
}

export const HouseColumns: ColumnDef<HouseColumnsType>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "title",
    header: () => <div>Title</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const house = row.original;

      const title: string = row.getValue("title");
      return (
        <div className="ml-1 w-[480px] overflow-hidden">
          <Link href={`/house/${house.id}`} passHref legacyBehavior>
            <Button variant="link" className="p-0 h-8">
              {title}
            </Button>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: () => <div className="text-center mx-auto">City</div>,
    cell: ({ row }) => {
      const address: HouseAddress = row.getValue("address");
      const city = address.city;
      return <div className="text-center capitalize">{city}</div>;
    },
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-center mx-auto">Duration</div>,
    cell: ({ row }) => {
      const duration: "temporary" | "permanent" = row.getValue("duration");
      return <div className="text-center capitalize">{duration}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <span className="flex justify-center">
          <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price
            {column.getIsSorted() === "asc" ? (
              <ArrowDownIcon className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowUpIcon className="ml-1 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-1 h-4 w-4" />
            )}
          </Button>
        </span>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "available",
    header: ({ column }) => {
      return (
        <span className="flex justify-center">
          <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Available
            {column.getIsSorted() === "asc" ? (
              <ArrowDownIcon className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowUpIcon className="ml-1 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-1 h-4 w-4" />
            )}
          </Button>
        </span>
      );
    },
    cell: ({ row }) => {
      const updatedAt: Date = row.getValue("available");
      return (
        <div className="text-center">
          {updatedAt.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const house = row.original;
      const currentUser = GetCurrentUser();
      const handleSaveAd = async () => {
        if (currentUser && currentUser.uid) {
          const data = await savehouse(house.id!, currentUser.uid);
          if (data.error) toast.error(data.error);
          else toast.success(data.message);
        }
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`/house/${house.id}`}>View Details</Link>
            </DropdownMenuItem>
            {currentUser?.uid !== house.postedBy && (
              <>
                {house.savedBy.includes(currentUser?.uid!) ? (
                  <DropdownMenuItem className="text-muted-foreground focus:text-muted-foreground">
                    Saved
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleSaveAd} className="cursor-pointer">
                    Save
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/user/${house.postedBy}`}>View User</Link>
                </DropdownMenuItem>
                {currentUser?.emailVerified && (
                  <DropdownMenuItem>
                    <Link href={`/message/${currentUser?.uid}/${house.postedBy}/house/${house.id}`}>Send Message</Link>
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];
