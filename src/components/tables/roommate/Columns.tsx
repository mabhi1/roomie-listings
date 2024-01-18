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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
  duration: "temporary" | "permanent";
  updatedAt: Date;
};

function getCurrentUser() {
  const currentUser = useAuth();
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
    header: () => <div className="w-96">Title</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const roommate = row.original;

      const title: string = row.getValue("title");
      return (
        <div className="ml-1">
          <Link href={`/roommate/${roommate.id}`} passHref legacyBehavior>
            <Button variant="link" className="p-0 h-0">
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
      const address: RoommateAddress = row.getValue("address");
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
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <span className="flex justify-center">
          <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Budget
            <ArrowUpDown className="ml-1 h-4 w-4" />
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
          <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Move In
            <ArrowUpDown className="ml-1 h-4 w-4" />
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
      const currentUser = getCurrentUser();
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
            {currentUser?.uid !== roommate.postedBy && (
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
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/user/${roommate.postedBy}`}>View User</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Send Message</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];
