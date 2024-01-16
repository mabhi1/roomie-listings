"use client";

import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { uploadFile } from "@/firebase/firebaseDBFunctions";
import { User } from "firebase/auth";
import { updateName, updatePhoto } from "@/firebase/firebaseAuthFunctions";
import { updateProfilePicture, updateUserName } from "@/actions/user";

export default function EditProfileForm({
  currentUser,
  setDialog,
}: {
  currentUser: User;
  setDialog?: Dispatch<SetStateAction<boolean>>;
}) {
  const [picture, setPicture] = useState<File>();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (picture) {
        const url = await uploadFile(currentUser.uid, picture);
        await updatePhoto(url);
        await updateProfilePicture(currentUser.uid, url);
        (document.getElementById("picture") as HTMLInputElement).value = "";
      }
      if (name.trim().length > 0 && isNaN(Number(name))) {
        await updateName(name);
        await updateUserName(currentUser.uid, name);
      }
      setPicture(undefined);
      setName("");
      setLoading(false);
      if (setDialog) setDialog(false);
      toast.success("Profile updated successfully");
    } catch (e) {
      toast.error("Error in updating profile");
      if (setDialog) setDialog(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleChangeProfile}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="picture" className="text-right">
            Change Picture
          </Label>
          <Input
            id="picture"
            type="file"
            className="col-span-3"
            accept="image/*"
            onChange={(e) => {
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

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Change Name
          </Label>
          <Input
            id="name"
            type="text"
            className="col-span-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button type="submit" className="ml-auto" disabled={loading}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
