"use client";

import { Button } from "../ui/button";
import useAuth from "../providers/AuthProvider";
import { useTransition } from "react";
import { deleteComment, likeComment, reportComment } from "@/actions/comment";
import { toast } from "sonner";
import { Comment } from "@/lib/types";
import { DeleteIcon, HelpingHandIcon, MessageSquareXIcon } from "lucide-react";

export default function CommentButtons({ comment, adId }: { comment: Comment; adId: string }) {
  const { currentUser } = useAuth();
  const [isPending, startTransition] = useTransition();

  const handleDelteComment = () => {
    startTransition(async () => {
      const data = await deleteComment(comment.id!, adId, comment.postType);
      if (data.error) toast.error(data.error);
      else toast.success(data.message);
    });
  };

  const handleLikeComment = () => {
    if (currentUser && currentUser.uid)
      startTransition(async () => {
        const data = await likeComment(comment.id!, currentUser.uid, adId, comment.postType);
        if (data.error) toast.error(data.error);
        else toast.success(data.message);
      });
  };

  const handleReportComment = () => {
    if (currentUser && currentUser.uid)
      startTransition(async () => {
        const data = await reportComment(comment.id!, currentUser.uid, adId, comment.postType);
        if (data.error) toast.error(data.error);
        else toast.success(data.message);
      });
  };

  if (!currentUser) return;
  else
    return (
      <>
        {comment.likes.length > 0 && (
          <span className="text-xs text-muted-foreground">{comment.likes.length} people found this helpful</span>
        )}
        {comment.reports.length > 0 && (
          <span className="text-xs text-muted-foreground">{comment.reports.length} people reported this Ad</span>
        )}
        {currentUser.uid === comment.uid ? (
          <Button className="w-fit" variant="destructive" size="sm" onClick={handleDelteComment} disabled={isPending}>
            <DeleteIcon className="mr-1 w-3.5" />
            Delete
          </Button>
        ) : currentUser?.emailVerified ? (
          <div className="flex gap-3">
            <Button variant="outline" size="sm" disabled={isPending} onClick={handleLikeComment}>
              <HelpingHandIcon className="mr-1 w-3.5" />
              Helpful
            </Button>
            <Button variant="destructive" size="sm" disabled={isPending} onClick={handleReportComment}>
              <MessageSquareXIcon className="w-3.5 mr-1" />
              Report
            </Button>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">Please verify your email to like or report this comment.</div>
        )}
      </>
    );
}
