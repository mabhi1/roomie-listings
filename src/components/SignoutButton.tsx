"use client";

import { dosignOut } from "@/firebase/firebaseFunctions";
import { Button } from "./ui/button";
import useAuth from "./providers/AuthProvider";
import { UserXIcon } from "lucide-react";
import { toast } from "sonner";

export default function SignoutButton() {
  const currentUser = useAuth();

  const handleSignout = async () => {
    try {
      await dosignOut();
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    }
  };

  if (currentUser)
    return (
      <Button variant="ghost" onClick={handleSignout}>
        <UserXIcon className="mr-1 w-4" />
        Sign out
      </Button>
    );
}
