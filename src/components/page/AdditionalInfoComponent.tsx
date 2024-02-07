"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BeanIcon,
  BeanOffIcon,
  CigaretteIcon,
  CigaretteOffIcon,
  FishIcon,
  FishOffIcon,
  MonitorIcon,
  MonitorOffIcon,
} from "lucide-react";
import { RoomRequirements } from "@/lib/types";

export default function AdditionalInfoComponent({ requirements }: { requirements: RoomRequirements }) {
  return (
    <Card className="rounded-none border-0 shadow-none">
      <CardHeader className="p-0 px-3 md:p-5">
        <CardTitle className="text-sm font-normal underline underline-offset-2 md:text-lg">
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3 p-3 md:gap-8 md:p-5 md:pt-0">
        {requirements.vegetarian !== null && (
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-[#00a303] px-1">
              {requirements.vegetarian === true ? (
                <BeanIcon color="#00a303" className="w-4" />
              ) : (
                <BeanOffIcon color="#00a303" className="w-4" />
              )}
            </div>
            <div className="font-medium capitalize">
              {requirements.vegetarian === true ? "Vegetarian Preferred" : "No Vegetarian Preference"}
            </div>
          </div>
        )}
        {requirements.petFriendly !== null && (
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-[#0031a3] px-1">
              {requirements.petFriendly === true ? (
                <FishIcon color="#0031a3" className="w-4" />
              ) : (
                <FishOffIcon color="#0031a3" className="w-4" />
              )}
            </div>
            <div className="font-medium capitalize">
              {requirements.petFriendly ? "Pet Friendly" : "No Pets Allowed"}
            </div>
          </div>
        )}
        {requirements.smoking !== null && (
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-[#7800a3] px-1">
              {requirements.smoking === "no" ? (
                <CigaretteOffIcon color="#7800a3" className="w-4" />
              ) : (
                <CigaretteIcon color="#7800a3" className="w-4" />
              )}
            </div>
            <div className="font-medium capitalize">{`${requirements.smoking} smoking`}</div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-[#a34f00] px-1">
            {requirements.furnished ? (
              <MonitorIcon color="#a34f00" className="w-4" />
            ) : (
              <MonitorOffIcon color="#a34f00" className="w-4" />
            )}
          </div>
          <div className="font-medium capitalize">{requirements.furnished ? "Furnished" : "Not Furnished"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
