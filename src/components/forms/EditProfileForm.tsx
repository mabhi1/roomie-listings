"use client";

import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { uploadFile } from "@/firebase/firebaseDBFunctions";
import { User as AuthUser } from "firebase/auth";
import { updateName, updatePhoto } from "@/firebase/firebaseAuthFunctions";
import { updateProfilePicture, updateUserName } from "@/actions/user";
import { HardDriveDownloadIcon } from "lucide-react";
import { User } from "@prisma/client";

export default function EditProfileForm({
  currentUser,
  setDialog,
  setCurrentUser,
}: {
  currentUser: AuthUser;
  setDialog?: Dispatch<SetStateAction<boolean>>;
  setCurrentUser: Dispatch<SetStateAction<User | undefined>>;
}) {
  const [picture, setPicture] = useState<File>();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const changeProfilePicture = async () => {
    if (!picture) return null;
    const { url } = await uploadFile(currentUser.uid, picture);
    await updatePhoto(url);
    await updateProfilePicture(currentUser.uid, url);
    (document.getElementById("picture") as HTMLInputElement).value = "";
    return url;
  };

  const handleChangeProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = await changeProfilePicture();
      if (name.trim().length > 0 && isNaN(Number(name))) {
        await updateName(name);
        await updateUserName(currentUser.uid, name);
      }
      setCurrentUser(user => user && { ...user, photo: url, name: name ? name : user.name });
      if (setDialog) setDialog(false);
      toast.success("Profile updated successfully");
    } catch (e) {
      toast.error("Error in updating profile");
      if (setDialog) setDialog(false);
    }
  };

  return (
    <form onSubmit={handleChangeProfile}>
      <div className="grid gap-4 py-4">
        <div className="flex grid-cols-4 flex-col gap-2 md:grid md:items-center md:gap-4">
          <Label htmlFor="picture" className="md:text-right">
            Change Picture
          </Label>
          <Input
            id="picture"
            type="file"
            className="col-span-3"
            accept="image/*"
            onChange={e => {
              if (!e.target.files || e.target.files.length === 0) return;
              const file = e.target.files[0];
              if (file.size > 2097152) {
                toast.info("Image size too big. Maximum 2MB allowed");
                e.target.value = "";
                setPicture(undefined);
                return;
              }
              setPicture(e.target.files[0]);
            }}
          />
        </div>

        <div className="flex grid-cols-4 flex-col gap-2 md:grid md:items-center md:gap-4">
          <Label htmlFor="name" className="md:text-right">
            Change Name
          </Label>
          <Input
            id="name"
            type="text"
            className="col-span-3"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button type="submit" className="ml-auto" disabled={loading}>
          <HardDriveDownloadIcon className="mr-1 w-4" />
          Save changes
        </Button>
      </div>
    </form>
  );
}
