"use client";

import { dosignOut } from "@/firebase/firebaseFunctions";
import { Button } from "../ui/button";
import useAuth from "../providers/AuthProvider";
import { UserXIcon } from "lucide-react";
import { toast } from "sonner";

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

export default function SignoutButton({ variant }: { variant: Variant }) {
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
      <Button variant={variant} onClick={handleSignout}>
        <UserXIcon className="mr-1 w-4" />
        Sign out
      </Button>
    );
}
