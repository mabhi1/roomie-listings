"use client";

import { updateProfilePicture } from "@/actions/user";
import ProfileButtons from "@/components/buttons/ProfileButtons";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import useAuth from "@/components/providers/AuthProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RoomProfilePage from "@/components/tables/room/ProfilePage";
import RoommateProfileTable from "@/components/tables/roommate/ProfilePage";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updatePhoto } from "@/firebase/firebaseAuthFunctions";
import { deleteFile } from "@/firebase/firebaseDBFunctions";
import { toastMessage } from "@/lib/constants";
import { sendEmailVerification } from "firebase/auth";
import { BadgeCheckIcon, BadgeXIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import noUserImage from "../../../public/user.png";
import { useState } from "react";

export default function Profile() {
  const [tabType, setTabType] = useState("rentals");
  const { currentUser } = useAuth();

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification(currentUser!);
      toast.success(toastMessage.emailVerificationSuccess);
    } catch (error) {
      toast.error(toastMessage.emailVerificationError);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      if (!currentUser?.photoURL?.includes("google")) await deleteFile(currentUser?.uid!);
      await updatePhoto("");
      await updateProfilePicture(currentUser?.uid!, null);
      toast.success("Profile picture removed successfully");
    } catch (error: any) {
      toast.error("Error in removing profile picture");
    }
  };

  if (currentUser)
    return (
      <FullWrapper className="gap-3 md:gap-5">
        <PageHeader
          heading="My Profile"
          subHeading="This is your profile page. You can see the related comments and ads here."
        />
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
          <div className="flex flex-1 gap-3 lg:gap-5">
            <div className="group relative h-fit w-fit overflow-clip rounded-full border">
              <Image
                src={currentUser.photoURL ? currentUser.photoURL : noUserImage}
                alt={currentUser.displayName!}
                width={50}
                height={50}
                className="h-[60px] w-[60px] object-cover md:h-[80px] md:w-[80px] xl:h-[90px] xl:w-[90px]"
                priority
                placeholder="blur"
                blurDataURL={currentUser.photoURL ? currentUser.photoURL : ""}
              />
              {currentUser.photoURL && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 hidden w-full border bg-primary-foreground/80 pt-1 text-xs group-hover:block md:h-7"
                  onClick={handleRemoveProfilePicture}
                >
                  Remove
                </Button>
              )}
            </div>
            <div className="mr-auto flex flex-col justify-center">
              <div className="text-base md:text-lg">{currentUser.displayName}</div>
              <div className="w-[16rem] overflow-hidden text-ellipsis text-nowrap lg:w-[25rem] xl:w-[30rem]">
                {currentUser.email}
              </div>
              {currentUser.emailVerified ? (
                <span className="flex items-center gap-1 text-success">
                  <BadgeCheckIcon className="w-3 md:w-4" /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-destructive">
                  <BadgeXIcon className="w-3 md:w-4" />
                  <span>Not Verified</span>
                  <Button onClick={handleSendVerification} variant="link" className="h-0 p-0 md:h-0">
                    &#40;Send Verification link&#41;
                  </Button>
                </span>
              )}
            </div>
          </div>
          <ProfileButtons currentUser={currentUser} />
        </div>
        <Tabs defaultValue="savedAds" className="mt-3 w-full md:mt-0 md:space-y-5">
          <div className="flex flex-col items-end justify-between gap-2 md:flex-row">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="savedAds">Favourites</TabsTrigger>
              <TabsTrigger value="postedAds">Posts</TabsTrigger>
              <TabsTrigger value="reportedAds">Reports</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div>Select Ad type</div>
              <Select value={tabType} onValueChange={setTabType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select ad type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rentals">Rentals</SelectItem>
                  <SelectItem value="roommates">Roommates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <TabsContent value="savedAds">
            {tabType === "rentals" ? (
              <RoomProfilePage currentUser={currentUser} tab="savedAds" />
            ) : (
              <RoommateProfileTable currentUser={currentUser} tab="savedAds" />
            )}
          </TabsContent>
          <TabsContent value="postedAds">
            {tabType === "rentals" ? (
              <RoomProfilePage currentUser={currentUser} tab="postedAds" />
            ) : (
              <RoommateProfileTable currentUser={currentUser} tab="postedAds" />
            )}
          </TabsContent>
          <TabsContent value="reportedAds">
            {tabType === "rentals" ? (
              <RoomProfilePage currentUser={currentUser} tab="reportedAds" />
            ) : (
              <RoommateProfileTable currentUser={currentUser} tab="reportedAds" />
            )}
          </TabsContent>
        </Tabs>
      </FullWrapper>
    );
}
