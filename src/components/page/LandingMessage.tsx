"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function LandingMessage() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const announcementUpdated = localStorage.getItem("roomie_listings_announcement");
    if (announcementUpdated) {
      const date = parseInt(announcementUpdated);
      if (Date.now() - date >= 86400000) {
        setOpen(true);
        localStorage.setItem("roomie_listings_announcement", Date.now().toString());
      }
    } else {
      setOpen(true);
      localStorage.setItem("roomie_listings_announcement", Date.now().toString());
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-3/4 rounded">
        <DialogHeader className="gap-5">
          <DialogTitle>Announcement</DialogTitle>
          <DialogDescription>Currently live in New Jersey only.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
