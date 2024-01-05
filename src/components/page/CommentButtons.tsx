"use client";

import { Button } from "../ui/button";
import useAuth from "../providers/AuthProvider";
import { useTransition } from "react";
import { deleteComment } from "@/actions/comment";
import { toast } from "sonner";

export default function CommentButtons({
  userId,
  commentId,
  adId,
}: {
  userId: string;
  commentId: string;
  adId: string;
}) {
  const currentUser = useAuth();
  const [isPending, startTransition] = useTransition();

  const handleDelteComment = () => {
    startTransition(async () => {
      const data = await deleteComment(commentId, adId);
      if (data.error) toast.error(data.error);
      toast.success(data.message);
    });
  };

  if (currentUser?.uid === userId)
    return (
      <Button className="w-fit" variant="outline" size="sm" onClick={handleDelteComment} disabled={isPending}>
        Delete
      </Button>
    );
  else
    return (
      <div className="flex gap-3">
        <Button variant="outline" size="sm" disabled={isPending}>
          Helpful
        </Button>
        <Button variant="destructive" size="sm" disabled={isPending}>
          Report
        </Button>
      </div>
    );
}
