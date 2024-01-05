"use client";

import { Button } from "../ui/button";
import useAuth from "../providers/AuthProvider";
import { useTransition } from "react";
import { deleteComment, likeComment, reportComment } from "@/actions/comment";
import { toast } from "sonner";
import { Comment } from "@/lib/types";

export default function CommentButtons({ comment, adId }: { comment: Comment; adId: string }) {
  const currentUser = useAuth();
  const [isPending, startTransition] = useTransition();

  const handleDelteComment = () => {
    startTransition(async () => {
      const data = await deleteComment(comment.id!, adId);
      if (data.error) toast.error(data.error);
      toast.success(data.message);
    });
  };

  const handleLikeComment = () => {
    if (currentUser && currentUser.uid)
      startTransition(async () => {
        const data = await likeComment(comment.id!, currentUser.uid, adId);
        if (data.error) toast.error(data.error);
        toast.success(data.message);
      });
  };

  const handleReportComment = () => {
    if (currentUser && currentUser.uid)
      startTransition(async () => {
        const data = await reportComment(comment.id!, currentUser.uid, adId);
        if (data.error) toast.error(data.error);
        toast.success(data.message);
      });
  };

  const commentLikes = comment.likes?.filter((id) => id !== currentUser?.uid);
  const commentReports = comment.reports?.filter((id) => id !== currentUser?.uid);

  if (!currentUser) return;
  else
    return (
      <>
        {commentLikes && commentLikes.length > 0 && (
          <span className="text-xs text-muted-foreground">{commentLikes.length} people found this helpful</span>
        )}
        {commentReports && commentReports.length > 0 && (
          <span className="text-xs text-muted-foreground">{commentReports.length} people reported this Ad</span>
        )}
        {currentUser.uid === comment.uid ? (
          <Button className="w-fit" variant="outline" size="sm" onClick={handleDelteComment} disabled={isPending}>
            Delete
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" size="sm" disabled={isPending} onClick={handleLikeComment}>
              Helpful
            </Button>
            <Button variant="destructive" size="sm" disabled={isPending} onClick={handleReportComment}>
              Report
            </Button>
          </div>
        )}
      </>
    );
}
