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
import { RoommateAddress } from "@/lib/types";
import Link from "next/link";
import useAuth from "@/components/providers/AuthProvider";
import { saveRoommate } from "@/actions/roommate";
import { toast } from "sonner";

export type RoommateColumnsType = {
  id: string;
  title: string;
  address: {
    city: string;
    state: string;
  };
  budget: number;
  postedBy: string;
  savedBy: string[];
  moveIn: Date;
  stay: "temporary" | "permanent";
  updatedAt: Date;
};

function GetCurrentUser() {
  const { currentUser } = useAuth();
  return currentUser;
}

export const RoommateColumns: ColumnDef<RoommateColumnsType>[] = [
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
    header: () => <div className="w-[260px] lg:w-[450px] xl:w-[480px]">Title</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const roommate = row.original;

      const title: string = row.getValue("title");
      return (
        <div className="ml-1 w-[260px] overflow-hidden lg:w-[450px] xl:w-[480px]">
          <Link href={`/roommate/${roommate.id}`} passHref legacyBehavior>
            <Button variant="link" className="h-8 p-0">
              {title}
            </Button>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: () => <div className="mx-auto text-center">City</div>,
    cell: ({ row }) => {
      const address: RoommateAddress = row.getValue("address");
      const city = address.city;
      return <div className="w-20 text-center capitalize">{city}</div>;
    },
  },
  {
    accessorKey: "stay",
    header: () => <div className="mx-auto text-center">Stay</div>,
    cell: ({ row }) => {
      const stay: "temporary" | "permanent" = row.getValue("stay");
      return <div className="text-center capitalize">{stay}</div>;
    },
  },
  {
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <span className="flex justify-center">
          <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Budget
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
      const budget = parseFloat(row.getValue("budget"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(budget);

      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "moveIn",
    header: ({ column }) => {
      return (
        <span className="flex justify-center">
          <Button
            variant="ghost"
            className="w-20 p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Move In
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
      const updatedAt: Date = row.getValue("moveIn");
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
      const roommate = row.original;
      const currentUser = GetCurrentUser();
      const handleSaveAd = async () => {
        if (currentUser && currentUser.uid) {
          const data = await saveRoommate(roommate.id!, currentUser.uid);
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
              <Link href={`/roommate/${roommate.id}`}>View Details</Link>
            </DropdownMenuItem>
            {currentUser && currentUser.uid !== roommate.postedBy && (
              <>
                {roommate.savedBy.includes(currentUser?.uid!) ? (
                  <DropdownMenuItem className="text-muted-foreground focus:text-muted-foreground">
                    Saved
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleSaveAd} className="cursor-pointer">
                    Save
                  </DropdownMenuItem>
                )}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/user/${roommate.postedBy}`}>View User</Link>
            </DropdownMenuItem>
            {currentUser && currentUser.uid !== roommate.postedBy && currentUser.emailVerified && (
              <DropdownMenuItem>
                <Link href={`/message/${currentUser?.uid}/${roommate.postedBy}/roommate/${roommate.id}`}>
                  Send Message
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];
