"use client";

import useAuth from "../providers/AuthProvider";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { addComment } from "@/actions/comment";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Label } from "../ui/label";
import { SubtitlesIcon } from "lucide-react";

export default function AddComment({ postId, postType }: { postId: string; postType: "house" | "roommate" }) {
  const [isPending, startTransition] = useTransition();
  const [comment, setComment] = useState("");
  const currentUser = useAuth();

  const handleAddComment = async () => {
    if (!comment || comment.trim().length === 0) return;
    startTransition(async () => {
      const data:
        | {
            error: string;
            message?: undefined;
          }
        | {
            message: string;
            error?: undefined;
          } = await addComment(comment, currentUser?.uid!, postId, postType);
      if (data.error) toast.error(data.error);
      else toast.success(data.message);
      setComment("");
    });
  };

  return (
    <div className="flex flex-col w-1/4">
      <Label htmlFor="comment">Add a comment</Label>
      <span className="text-muted-foreground text-xs">Share your thoughts on this Ad</span>
      {currentUser ? (
        currentUser?.emailVerified ? (
          <form action={handleAddComment} className="flex flex-col gap-3 mt-5">
            <Input
              type="text"
              placeholder="Enter comment"
              name="comment"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button type="submit" disabled={isPending}>
              <SubtitlesIcon className="w-4 mr-1" />
              Submit
            </Button>
          </form>
        ) : (
          <div className="mt-5">Please verify your email to add a comment.</div>
        )
      ) : (
        <div className="mt-5">Please sign in to add a comment.</div>
      )}
    </div>
  );
}
