import Spinner from "@/components/page/Spinner";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Comment } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckSquareIcon, XCircleIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteComment, deleteReportedComment, getAllComments } from "@/actions/comment";

export default function CommentProfileTable({ currentUser, tab }: { currentUser: User; tab: string }) {
  const [comments, setComments] = useState<Comment[] | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getComments() {
      const comments = await getAllComments(currentUser.uid, tab);
      setComments(comments);
      setLoading(false);
    }
    getComments();
  }, [currentUser.uid, tab]);

  const handleDeleteComment = async (commentId: string, postId: string, postType: "house" | "roommate") => {
    setLoading(true);
    switch (tab) {
      case "comments":
        const comment = await deleteComment(commentId, postId, postType);
        if (!comment) {
          toast.error("Error removing Comment");
          return;
        }
        setComments((comments) => comments?.filter((com) => com.id !== commentId));
        setLoading(false);
        toast.success("Comment removed successfully");
        return;
      case "reportedComments":
        const comment1 = await deleteReportedComment(commentId, currentUser.uid!, postId, postType);
        if (!comment1) {
          toast.error("Error removing Comment");
          return;
        }
        setComments((comments) => comments?.filter((com) => com.id !== commentId));
        setLoading(false);
        toast.success("Comment removed successfully");
        return;
      default:
        setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="w-full mt-10 flex justify-center">
        <Spinner size="medium" />
      </div>
    );
  else if (!comments || comments.length === 0) return <div className="w-full flex justify-center">0 Comments</div>;
  else
    return (
      <Table className="border">
        <TableHeader className="h-6">
          <TableRow className="bg-muted/50">
            <TableHead className="w-1/2 border-r font-normal text-accent-foreground h-8">Comment</TableHead>
            <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Ad Type</TableHead>
            <TableHead className="border-r text-center font-normal text-accent-foreground h-8">Commented on</TableHead>
            <TableHead className="text-center font-normal text-accent-foreground h-8"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments?.map((comment) => (
            <TableRow className="hover:bg-inherit" key={comment.id}>
              <TableCell className="border-r py-1 pl-4">
                <Link
                  href={`/${comment.postType}/${comment.postId}#${comment.id}`}
                  className="block w-[800px] overflow-hidden"
                >
                  <Button variant="link" className="p-0">
                    {comment.comment}
                  </Button>
                </Link>
              </TableCell>
              <TableCell className="border-r text-center py-1 capitalize">{`${comment.postType}`}</TableCell>
              <TableCell className="border-r text-center py-1">
                {comment.updatedAt?.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              </TableCell>
              <TableCell className="text-center capitalize py-1">
                <Dialog>
                  <DialogTrigger>
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <XCircleIcon className="mx-auto text-destructive cursor-pointer w-5" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Delete</DialogTitle>
                      <DialogDescription>Are you sure you want to delete this comment?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button onClick={() => handleDeleteComment(comment.id!, comment.postId, comment.postType)}>
                        <CheckSquareIcon className="w-4 mr-1" />
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
}
