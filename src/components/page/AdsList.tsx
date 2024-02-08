"use client";

import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, EraserIcon, FilterIcon, SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import useAuth from "../providers/AuthProvider";
import { Button } from "../ui/button";
import { useCallback, useEffect, useState } from "react";
import IndividualAd from "./IndividualAd";
import { RoomAd, RoomAddress, RoommateAd } from "@/lib/types";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import MultiSelect from "../ui/multi-select";
import { toast } from "sonner";

export default function AdsList({ ads, page }: { ads: RoomAd[] | RoommateAd[]; page: "roommate" | "rental" }) {
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [selectedStay, setSelectedStay] = useState<string>("both");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(Number.MAX_SAFE_INTEGER);
  const [property, setProperty] = useState("all");
  const [rentType, setRentType] = useState("all");
  const [gender, setGender] = useState("any");
  const [filteredData, setFilteredData] = useState<RoomAd[] | RoommateAd[] | null | undefined>(ads);
  const [dateSort, setDateSort] = useState("");
  const [rentSort, setRentSort] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const { currentUser, currentCity } = useAuth();
  const itemsPerPage = 20;

  const getAllCities = useCallback(() => {
    const cities: string[] = [];
    ads.forEach((row: any) => {
      const address: RoomAddress = row.address;
      if (cities.includes(address.city.toUpperCase())) return;
      cities.push(address.city.toUpperCase());
    });
    return cities;
  }, [ads]);

  useEffect(() => {
    const adsSessionFilterRemoved = sessionStorage.getItem("roomie_listings_ads_filter");
    if (adsSessionFilterRemoved) return;
    const cities = getAllCities();
    if (cities.includes(currentCity)) setSelectedCity([currentCity]);
    else toast.info(`No ${page} ads in your city`);
  }, [currentCity, page, setSelectedCity, getAllCities]);

  useEffect(() => {
    const newData = ads
      .filter(row => (selectedCity.length === 0 ? true : selectedCity.includes(row.address.city.toUpperCase())))
      .filter(row => (selectedStay === "both" ? true : row.roomRequirements.stay === selectedStay))
      .filter(row => (min > max ? true : row.rent >= min && row.rent <= max))
      .filter(row => (property === "all" ? true : row.propertyType === property))
      .filter(row => (gender === "any" ? true : row.roomRequirements.gender === gender))
      .filter(row => (rentType === "all" ? true : row.roomRequirements.rentType === rentType))
      .filter(row => {
        if (searchTerm.trim() === "") return true;
        const term = searchTerm.trim().toLowerCase();
        if (
          row.address.city.toLowerCase().includes(term) ||
          row.address.state.toLowerCase().includes(term) ||
          row.description.includes(term) ||
          row.propertyType.includes(term) ||
          row.rent.toString().includes(term) ||
          row.title.includes(term) ||
          row.roomRequirements.gender.includes(term) ||
          row.roomRequirements.rentType.includes(term) ||
          row.roomRequirements.stay.includes(term)
        )
          return true;
      });

    if (dateSort === "asc") newData.sort((a, b) => new Date(a.moveIn).getTime() - new Date(b.moveIn).getTime());
    else if (dateSort === "des") newData.sort((a, b) => new Date(b.moveIn).getTime() - new Date(a.moveIn).getTime());
    if (rentSort === "asc") newData.sort((a, b) => a.rent - b.rent);
    else if (rentSort === "des") newData.sort((a, b) => b.rent - a.rent);

    setFilteredData(newData);
  }, [
    page,
    selectedStay,
    selectedCity,
    currentUser,
    ads,
    max,
    min,
    property,
    gender,
    dateSort,
    rentSort,
    rentType,
    searchTerm,
  ]);

  const handleClearFilter = () => {
    setSelectedCity([]);
    setSelectedStay("both");
    setMin(0);
    setMax(Number.MAX_SAFE_INTEGER);
    setProperty("all");
    setGender("any");
    setRentType("all");
    setSearchTerm("");
    sessionStorage.setItem("roomie_listings_ads_filter", "removed");
  };

  const isNotFiltered = () => {
    return (
      selectedCity.length === 0 &&
      selectedStay === "both" &&
      min === 0 &&
      max === Number.MAX_SAFE_INTEGER &&
      property === "all" &&
      gender === "any" &&
      rentType === "all" &&
      searchTerm === ""
    );
  };

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex flex-col gap-3 md:mb-5 md:flex-row lg:gap-5">
        <div className="flex flex-1 gap-3 lg:gap-5">
          <div className="relative mr-auto flex-1">
            <SearchIcon className="absolute left-2 top-1/2 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search ad"
              className="pl-7"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Sheet modal>
            <SheetTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="mr-1 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader className="space-y-0">
                <SheetTitle className="font-normal uppercase">Filter Ads</SheetTitle>
                <SheetDescription>Select the options below to filter the table.</SheetDescription>
              </SheetHeader>
              <div className="my-5 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <div>Stay</div>
                  <Select onValueChange={setSelectedStay} value={selectedStay}>
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue placeholder="Select stay..." />
                    </SelectTrigger>
                    <SelectContent>
                      {["short", "long", "both"].map(item => (
                        <SelectItem key={item} value={item} className="capitalize">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <div>Gender</div>
                  <Select onValueChange={setGender} value={gender}>
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue placeholder="Select gender..." />
                    </SelectTrigger>
                    <SelectContent>
                      {["male", "female", "any"].map(item => (
                        <SelectItem key={item} value={item} className="capitalize">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <div>Property Type</div>
                  <Select onValueChange={setProperty} value={property}>
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue placeholder="Select property type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="capitalize">
                        all
                      </SelectItem>
                      {["private room", "single room", "house"].map(item => (
                        <SelectItem key={item} value={item} className="capitalize">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <div>Cities</div>
                  <MultiSelect
                    label="cities"
                    data={getAllCities()}
                    selected={selectedCity}
                    setSelected={setSelectedCity}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div>Rent Type</div>
                  <Select onValueChange={setRentType} value={rentType}>
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue placeholder="Select rent type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="capitalize">
                        all
                      </SelectItem>
                      {["monthly", "daily", "weekly"].map(item => (
                        <SelectItem key={item} value={item} className="capitalize">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <div>Rent</div>
                  <div className="flex flex-col justify-evenly gap-2 md:flex-row md:items-center">
                    <span>Min: </span>
                    <Input
                      type="number"
                      className="md:w-28"
                      value={min}
                      onChange={e => setMin(Number(e.target.value))}
                      onWheel={e => (e.target as HTMLElement).blur()}
                    />
                    <span>Max: </span>
                    <Input
                      type="number"
                      className="md:w-28"
                      value={max}
                      onChange={e => setMax(Number(e.target.value))}
                      onWheel={e => (e.target as HTMLElement).blur()}
                    />
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button className="w-full" onClick={handleClearFilter}>
                  <EraserIcon className="mr-1 w-4" />
                  Clear Filter
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex gap-3 lg:gap-5">
          <Button
            variant="outline"
            onClick={() =>
              setRentSort(s => {
                setDateSort("");
                if (s === "" || s === "des") return "asc";
                return "des";
              })
            }
          >
            Sort by Rent
            {rentSort === "asc" && <ArrowDownIcon className="ml-1 w-4" />}
            {rentSort === "des" && <ArrowUpIcon className="ml-1 w-4" />}
            {rentSort === "" && <ArrowUpDownIcon className="ml-1 w-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setDateSort(s => {
                setRentSort("");
                if (s === "" || s === "des") return "asc";
                return "des";
              })
            }
          >
            Sort by Move in
            {dateSort === "asc" && <ArrowDownIcon className="ml-1 w-4" />}
            {dateSort === "des" && <ArrowUpIcon className="ml-1 w-4" />}
            {dateSort === "" && <ArrowUpDownIcon className="ml-1 w-4" />}
          </Button>
        </div>
      </div>
      {!isNotFiltered() && (
        <div className="mb-2 flex w-fit flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {searchTerm.trim() !== "" && (
            <div className="space-x-1">
              <span>Search term :</span>
              <span className="rounded bg-muted-foreground px-1 text-muted">{searchTerm}</span>
            </div>
          )}
          {selectedCity.length > 0 && (
            <div className="space-x-1">
              <span>Selected {selectedCity.length === 1 ? "City" : "Cities"} :</span>
              <span className="space-x-1">
                {selectedCity.map(city => (
                  <span key={city} className="rounded bg-muted-foreground px-1 text-muted">
                    {city}
                  </span>
                ))}
              </span>
            </div>
          )}
          {selectedStay !== "both" && (
            <div className="space-x-1">
              <span>Selected Stay :</span>
              <span className="rounded bg-muted-foreground px-1 capitalize text-muted">{selectedStay}</span>
            </div>
          )}
          {rentType !== "all" && (
            <div className="space-x-1">
              <span>Rent Type :</span>
              <span className="rounded bg-muted-foreground px-1 capitalize text-muted">{rentType}</span>
            </div>
          )}
          {min !== 0 && (
            <div className="space-x-1">
              <span>Min Rent :</span>
              <span className="rounded bg-muted-foreground px-1 capitalize text-muted">${min}</span>
            </div>
          )}
          {max !== Number.MAX_SAFE_INTEGER && (
            <div className="space-x-1">
              <span>Max Rent :</span>
              <span className="rounded bg-muted-foreground px-1 capitalize text-muted">${max}</span>
            </div>
          )}
          {property !== "all" && (
            <div className="space-x-1">
              <span>Property type :</span>
              <span className="rounded bg-muted-foreground px-1 capitalize text-muted">{property}</span>
            </div>
          )}
          {gender !== "any" && (
            <div className="space-x-1">
              <span>Gender :</span>
              <span className="rounded bg-muted-foreground px-1 capitalize text-muted">{gender}</span>
            </div>
          )}
          <Button variant="link" className="h-[10px] p-0 md:h-[10px]" onClick={handleClearFilter}>
            Clear filters
          </Button>
        </div>
      )}
      {filteredData?.length === 0 && (
        <div className="flex h-32 w-full items-center justify-center rounded border capitalize">No {page} Ads</div>
      )}
      <div className="flex flex-col gap-3 md:gap-5">
        {filteredData
          ?.slice(startIndex, startIndex + itemsPerPage)
          .map(ad => <IndividualAd ad={ad} key={ad.id} setAds={setFilteredData} list />)}
      </div>
      {filteredData && (
        <div className="my-5 flex items-center gap-3 md:gap-5">
          <div className="ml-2 mr-auto capitalize">{`Page ${startIndex / itemsPerPage + 1} of ${Math.ceil(filteredData.length / itemsPerPage)}`}</div>
          <Button
            variant="secondary"
            onClick={() => {
              if (startIndex !== 0) setStartIndex(startIndex - itemsPerPage);
            }}
            disabled={startIndex === 0}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (startIndex / itemsPerPage + 1 < Math.ceil(filteredData.length / itemsPerPage))
                setStartIndex(startIndex + itemsPerPage);
            }}
            className="cursor-pointer"
            disabled={startIndex / itemsPerPage + 1 === Math.ceil(filteredData.length / itemsPerPage)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
