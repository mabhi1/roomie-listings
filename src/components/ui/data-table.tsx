"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  Row,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./button";
import { Input } from "./input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnsIcon, FilterIcon, SearchIcon } from "lucide-react";
import { HouseAddress } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiSelect from "./multi-select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: string;
}

export default function DataTable<TData, TValue>({ columns, data, page }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(Number.MAX_SAFE_INTEGER);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const filterColumnMapping = {
    title: "title",
    address: "city",
    budget: "budget",
    price: "price",
    duration: "duration",
    updatedAt: "last updated",
  };

  const handleClearFilter = () => {
    console.log("reset");
    setSelectedCity([]);
    setSelectedDuration("all");
    setMin(0);
    setMax(Number.MAX_SAFE_INTEGER);
  };

  const getFilteredRows = (rows: Row<TData>[]) => {
    return rows
      .filter((row) => {
        if (selectedCity.length === 0) return true;
        return selectedCity.includes((row.getValue("address") as HouseAddress).city);
      })
      .filter((row) => {
        if (selectedDuration === "all") return true;
        return row.getValue("duration") === selectedDuration;
      })
      .filter((row) => {
        let amount;
        if (page === "roommate") amount = row.getValue("budget") as number;
        else amount = row.getValue("price") as number;
        if (min > max) return true;
        return amount >= min && amount <= max;
      });
  };

  const getAllCities = () => {
    const cities: string[] = [];
    table.getRowModel().rows.forEach((row) => {
      const address: HouseAddress = row.getValue("address");
      if (cities.includes(address.city)) return;
      cities.push(address.city);
    });
    return cities;
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title"
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
            className="w-80 pl-7"
          />
        </div>

        <Sheet modal>
          <SheetTrigger className="ml-auto mr-4" asChild>
            <Button variant="outline">
              <FilterIcon className="mr-1 w-4" />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[50rem]">
            <SheetHeader className="space-y-0">
              <SheetTitle>Filter Ads</SheetTitle>
              <SheetDescription>Select the options below to filter the table.</SheetDescription>
            </SheetHeader>
            <div className="my-5 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="font-medium">Duration</div>
                <Select onValueChange={(value) => setSelectedDuration(value)} value={selectedDuration}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select duration..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="all">Select All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-medium">Cities</div>
                <MultiSelect
                  label="cities"
                  data={getAllCities()}
                  selected={selectedCity}
                  setSelected={setSelectedCity}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="font-medium">{page === "roommate" ? "Budget" : "Price"}</div>
                <div className="flex gap-2 justify-evenly items-center">
                  <span>Min: </span>
                  <Input type="number" className="w-28" value={min} onChange={(e) => setMin(Number(e.target.value))} />
                  <span>Max: </span>
                  <Input type="number" className="w-28" value={max} onChange={(e) => setMax(Number(e.target.value))} />
                </div>
              </div>
            </div>
            <SheetFooter>
              <Button className="w-full" onClick={handleClearFilter}>
                Clear Filter
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ColumnsIcon className="mr-1 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {(filterColumnMapping as any)[column.id]}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table className="font-normal">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-normal text-black bg-muted h-8 px-3 border-r last:border-r-0"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {getFilteredRows(table.getRowModel().rows)?.length ? (
              getFilteredRows(table.getRowModel().rows).map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-12 p-2 border-r last:border-r-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between pt-4">
        {/* <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div> */}
        <div className="flex items-center justify-end ml-auto space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
