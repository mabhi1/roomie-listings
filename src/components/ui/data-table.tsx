"use client";

import { useEffect, useState } from "react";
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
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ColumnsIcon,
  EraserIcon,
  EyeIcon,
  EyeOffIcon,
  FilterIcon,
  SearchIcon,
} from "lucide-react";
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
import useAuth from "../providers/AuthProvider";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: string;
  profile?: boolean;
}

export default function DataTable<TData, TValue>({ columns, data, page, profile }: DataTableProps<TData, TValue>) {
  const { currentUser, currentCity } = useAuth();
  const [showMyAd, setShowMyAd] = useState(true);
  const [rowData, setRowData] = useState(data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(Number.MAX_SAFE_INTEGER);

  const getAllCities = () => {
    const cities: string[] = [];
    data.forEach((row: any) => {
      const address: HouseAddress = row.address;
      if (cities.includes(address.city.toUpperCase())) return;
      cities.push(address.city.toUpperCase());
    });
    return cities;
  };

  useEffect(() => {
    const cities = getAllCities();
    if (cities.includes(currentCity)) setSelectedCity([currentCity]);
    else toast.info(`No ${page} ads in your city`);
  }, [currentCity, page, setSelectedCity]);

  useEffect(() => {
    setRowData(
      data
        .filter((row: any) => {
          if (selectedCity.length === 0) return true;
          return selectedCity.includes(row.address.city.toUpperCase());
        })
        .filter((row: any) => {
          if (selectedDuration === "all") return true;
          return row.duration === selectedDuration;
        })
        .filter((row: any) => {
          let amount;
          if (page === "roommate") amount = row.budget;
          else amount = row.price;
          if (min > max) return true;
          return amount >= min && amount <= max;
        })
        .filter((row: any) => {
          if (!currentUser) return true;
          const poster = row.postedBy;
          if (!showMyAd && poster === currentUser?.uid) return false;
          return true;
        })
    );
  }, [showMyAd, page, selectedDuration, selectedCity, currentUser?.uid, data, max, min]);

  const table = useReactTable({
    data: rowData,
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
      pagination: { pageIndex: 0, pageSize: 30 },
    },
  });

  const filterColumnMapping = {
    title: "title",
    address: "city",
    budget: "budget",
    price: "price",
    duration: "duration",
    updatedAt: "last updated",
    available: "available",
    moveIn: "move in",
  };

  const handleClearFilter = () => {
    setSelectedCity([]);
    setSelectedDuration("all");
    setMin(0);
    setMax(Number.MAX_SAFE_INTEGER);
  };

  const isNotFiltered = () => {
    return selectedCity.length === 0 && selectedDuration === "all" && min === 0 && max === Number.MAX_SAFE_INTEGER;
  };

  return (
    <div className="space-y-2">
      {!profile && (
        <>
          <div className="flex items-center mb-5">
            <div className="relative mr-auto">
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title"
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
                className="w-60 lg:w-80 pl-7"
              />
            </div>
            {currentUser && (
              <Button variant="outline" className="mr-2 lg:mr-4" onClick={() => setShowMyAd((showMyAd) => !showMyAd)}>
                {showMyAd ? <EyeOffIcon className="w-4 mr-1" /> : <EyeIcon className="w-4 mr-1" />}
                {showMyAd ? "Hide my ads" : "Show my ads"}
              </Button>
            )}
            <Sheet modal>
              <SheetTrigger className="mr-2 lg:mr-4" asChild>
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
                      <Input
                        type="number"
                        className="w-28"
                        value={min}
                        onChange={(e) => setMin(Number(e.target.value))}
                      />
                      <span>Max: </span>
                      <Input
                        type="number"
                        className="w-28"
                        value={max}
                        onChange={(e) => setMax(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <SheetFooter>
                  <Button className="w-full" onClick={handleClearFilter}>
                    <EraserIcon className="w-4 mr-1" />
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
          <div className="text-xs text-muted-foreground w-fit flex gap-2 flex-wrap">
            {currentUser && (
              <div className="space-x-1">
                <span>Your Ads :</span>
                <span className="bg-muted-foreground text-muted rounded px-1 capitalize">
                  {showMyAd ? "Visible" : "Hidden"}
                </span>
              </div>
            )}
            {selectedCity.length > 0 && (
              <div className="space-x-1">
                <span>Selected {selectedCity.length === 1 ? "City" : "Cities"} :</span>
                <span className="space-x-1">
                  {selectedCity.map((city) => (
                    <span key={city} className="bg-muted-foreground text-muted rounded px-1">
                      {city}
                    </span>
                  ))}
                </span>
              </div>
            )}
            {selectedDuration !== "all" && (
              <div className="space-x-1">
                <span>Selected Duration :</span>
                <span className="bg-muted-foreground text-muted rounded px-1 capitalize">{selectedDuration}</span>
              </div>
            )}
            {min !== 0 && (
              <div className="space-x-1">
                <span>Min {page === "roommate" ? "Budget" : "Price"} :</span>
                <span className="bg-muted-foreground text-muted rounded px-1 capitalize">${min}</span>
              </div>
            )}
            {max !== Number.MAX_SAFE_INTEGER && (
              <div className="space-x-1">
                <span>Max {page === "roommate" ? "Budget" : "Price"} :</span>
                <span className="bg-muted-foreground text-muted rounded px-1 capitalize">${max}</span>
              </div>
            )}
            {!isNotFiltered() && (
              <Button variant="link" className="p-0 h-4" onClick={handleClearFilter}>
                Clear filters
              </Button>
            )}
          </div>
        </>
      )}
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
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
      {!profile && (
        <div className="flex justify-between pt-4">
          {/* <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div> */}
          <div className="text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} row(s)</div>
          <div className="flex items-center justify-end ml-auto space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
              <ChevronRightIcon className="w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
