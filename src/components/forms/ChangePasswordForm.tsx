"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { changePassword } from "@/firebase/firebaseAuthFunctions";
import { User } from "firebase/auth";
import { HardDriveDownloadIcon } from "lucide-react";

export default function ChangePasswordForm({
  currentUser,
  setDialog,
}: {
  currentUser: User;
  setDialog?: Dispatch<SetStateAction<boolean>>;
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !password ||
      password.length === 0 ||
      !rePassword ||
      rePassword.length === 0 ||
      !oldPassword ||
      oldPassword.length === 0
    )
      return;
    if (password !== rePassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await changePassword(currentUser.email!, oldPassword, password);
      toast.success("Password changed successfully");
      setLoading(false);
      setOldPassword("");
      setPassword("");
      setRePassword("");
      if (setDialog) setDialog(false);
    } catch (error: any) {
      toast.error(error);
      setLoading(false);
      if (setDialog) setDialog(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-7 items-center gap-4">
          <Label htmlFor="old-password" className="col-span-2 text-right">
            Old Password
          </Label>
          <Input
            id="old-password"
            type="password"
            className="col-span-5"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value.trim())}
            placeholder="Enter old password"
          />
        </div>
        <div className="grid grid-cols-7 items-center gap-4">
          <Label htmlFor="password" className="col-span-2 text-right">
            New Password
          </Label>
          <Input
            id="password"
            type="password"
            className="col-span-5"
            value={password}
            onChange={e => setPassword(e.target.value.trim())}
            placeholder="Enter new password"
          />
        </div>
        <div className="grid grid-cols-7 items-center gap-4">
          <Label htmlFor="re-password" className="col-span-2 text-right">
            Re-type Password
          </Label>
          <Input
            id="re-password"
            type="password"
            className="col-span-5"
            value={rePassword}
            onChange={e => setRePassword(e.target.value.trim())}
            placeholder="Re-enter new password"
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
