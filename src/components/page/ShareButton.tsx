"use client";

import { RWebShare } from "react-web-share";
import { Button } from "../ui/button";
import { Share2Icon } from "lucide-react";
import { toast } from "sonner";

export default function ShareButton({
  url,
  text,
  title,
  onlyIcon,
}: {
  url: string;
  text: string;
  title: string;
  onlyIcon: boolean;
}) {
  return (
    <RWebShare
      data={{
        text,
        url,
        title,
      }}
      onClick={() => toast.success("Link Copied")}
    >
      <Button size="default" variant={onlyIcon ? "outline" : "secondary"}>
        <Share2Icon className="mr-1 w-4" />
        {onlyIcon ? "Share" : "Share this ad"}
      </Button>
    </RWebShare>
  );
}
