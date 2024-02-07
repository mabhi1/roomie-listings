"use client";

import { getUser, updateProfilePicture } from "@/actions/user";
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
import Image from "next/image";
import { toast } from "sonner";
import noUserImage from "../../../public/user.png";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import Spinner from "@/components/page/Spinner";

export default function Profile() {
  const [tabType, setTabType] = useState("rentals");
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (currentUser) {
        const user = await getUser(currentUser.uid);
        setUser(user);
        setLoading(false);
      }
    }
    fetchUser();
  }, [currentUser]);

  const handleRemoveProfilePicture = async () => {
    try {
      if (user?.photo?.includes("firebasestorage")) await deleteFile(user?.uid!);
      await updatePhoto("");
      await updateProfilePicture(user?.uid!, null);
      toast.success("Profile picture removed successfully");
      setUser(user => user && { ...user, photo: null });
    } catch (error: any) {
      toast.error("Error in removing profile picture");
    }
  };

  if (loading)
    return (
      <FullWrapper className="items-center pt-20">
        <Spinner size="large" />
      </FullWrapper>
    );

  if (user && currentUser)
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
                src={user.photo ? user.photo : noUserImage}
                alt={user.name}
                width={50}
                height={50}
                className="h-[60px] w-[60px] object-cover md:h-[80px] md:w-[80px] xl:h-[90px] xl:w-[90px]"
                priority
                placeholder="blur"
                blurDataURL={user.photo ? user.photo : ""}
              />
              {user.photo && (
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
              <div className="text-base capitalize md:text-lg">{user.name}</div>
              <div className="w-[16rem] overflow-hidden text-ellipsis text-nowrap lg:w-[25rem] xl:w-[30rem]">
                {user.email}
              </div>
            </div>
          </div>
          <ProfileButtons currentUser={currentUser} setCurrentUser={setUser} />
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
              <RoomProfilePage userId={user.uid} tab="savedAds" />
            ) : (
              <RoommateProfileTable userId={user.uid} tab="savedAds" />
            )}
          </TabsContent>
          <TabsContent value="postedAds">
            {tabType === "rentals" ? (
              <RoomProfilePage userId={user.uid} tab="postedAds" />
            ) : (
              <RoommateProfileTable userId={user.uid} tab="postedAds" />
            )}
          </TabsContent>
          <TabsContent value="reportedAds">
            {tabType === "rentals" ? (
              <RoomProfilePage userId={user.uid} tab="reportedAds" />
            ) : (
              <RoommateProfileTable userId={user.uid} tab="reportedAds" />
            )}
          </TabsContent>
        </Tabs>
      </FullWrapper>
    );
}
