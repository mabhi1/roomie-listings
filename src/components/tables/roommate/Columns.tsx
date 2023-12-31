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

export type RoommateColumns = {
  id: string;
  title: string;
  description: string;
  budget: number;
};

export const Columns: ColumnDef<RoommateColumns>[] = [
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
      const title: string = row.getValue("title");
      return <div className="ml-1">{title}</div>;
    },
  },
  {
    accessorKey: "address",
    header: () => <div className="text-center mx-auto">City</div>,
    cell: ({ row }) => {
      const address: string[] = (row.getValue("address") as string).split(", ");
      const city = address[address.length - 2];
      return <div className="text-center">{city}</div>;
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
    accessorKey: "updatedAt",
    header: () => <div className="text-center mx-auto">Last Updated</div>,
    cell: ({ row }) => {
      const updatedAt: Date = row.getValue("updatedAt");
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
      const payment = row.original;

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
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Poster</DropdownMenuItem>
            <DropdownMenuItem>Send Message</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];
