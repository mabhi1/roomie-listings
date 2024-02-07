"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CableCarIcon, CarIcon, DumbbellIcon, ShirtIcon, StoreIcon, WavesIcon } from "lucide-react";

export default function AmenitiesComponent({ amenities }: { amenities: string[] }) {
  const getAmenitiesIcon = (i: string) => {
    switch (i) {
      case "swimming pool":
        return <WavesIcon className="w-4" />;
      case "car park":
        return <CarIcon className="w-4" />;
      case "laundary":
        return <ShirtIcon className="w-4" />;
      case "gym":
        return <DumbbellIcon className="w-4" />;
      case "elevator":
        return <CableCarIcon className="w-4" />;
      case "club house":
        return <StoreIcon className="w-4" />;
    }
  };

  return (
    <Card className="rounded-none border-0 shadow-none">
      <CardHeader className="p-0 px-3 md:p-5">
        <CardTitle className="text-sm font-normal underline underline-offset-2 md:text-lg">Amenities</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3 p-3 md:gap-8 md:p-5 md:pt-0">
        {amenities.map(amenity => (
          <div key={amenity} className="flex items-center gap-1">
            <div className="rounded-full border border-primary bg-primary/70 px-1 text-white">
              {getAmenitiesIcon(amenity)}
            </div>
            <div className="font-medium capitalize">{amenity}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
