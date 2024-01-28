import Spinner from "@/components/page/Spinner";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Comment } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BanIcon, CheckSquareIcon, XCircleIcon } from "lucide-react";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { isMobile } from "react-device-detect";

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

  const handleDeleteComment = async (commentId: string, postId: string, postType: "room" | "roommate") => {
    setLoading(true);
    switch (tab) {
      case "comments":
        const comment = await deleteComment(commentId, postId, postType);
        if (!comment) {
          toast.error("Error removing Comment");
          return;
        }
        setComments(comments => comments?.filter(com => com.id !== commentId));
        setLoading(false);
        toast.success("Comment removed successfully");
        return;
      case "reportedComments":
        const comment1 = await deleteReportedComment(commentId, currentUser.uid!, postId, postType);
        if (!comment1) {
          toast.error("Error removing Comment");
          return;
        }
        setComments(comments => comments?.filter(com => com.id !== commentId));
        setLoading(false);
        toast.success("Comment removed successfully");
        return;
      default:
        setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="mt-10 flex w-full justify-center">
        <Spinner size="medium" />
      </div>
    );
  else if (!comments || comments.length === 0) return <div className="flex w-full justify-center">No Comments</div>;
  else
    return (
      <Table className="border">
        <TableHeader className="h-6">
          <TableRow className="bg-muted/50">
            <TableHead className="h-8 border-r font-normal text-accent-foreground">Comment</TableHead>
            <TableHead className="h-8 border-r text-center font-normal text-accent-foreground">Ad Type</TableHead>
            <TableHead className="h-8 border-r text-center font-normal text-accent-foreground">Commented on</TableHead>
            <TableHead className="h-8 border-r text-center font-normal text-accent-foreground">Reports</TableHead>
            <TableHead className="h-8 text-center font-normal text-accent-foreground"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments?.map(comment => (
            <TableRow className="hover:bg-inherit" key={comment.id}>
              <TableCell className="border-r py-1 pl-4">
                <Link
                  href={`/${comment.postType}/${comment.postId}#${comment.id}`}
                  className="block w-[260px] overflow-hidden md:w-[320px] lg:w-[500px] xl:w-[800px]"
                >
                  <Button variant="link" className="p-0">
                    {comment.comment}
                  </Button>
                </Link>
              </TableCell>
              <TableCell className="border-r py-1 text-center capitalize">{`${comment.postType}`}</TableCell>
              <TableCell className="min-w-32 border-r py-1 text-center">
                {comment.updatedAt?.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
              </TableCell>
              <TableCell className="border-r py-1 text-center">{comment.reports.length}</TableCell>
              <TableCell className="py-1 text-center capitalize">
                {isMobile ? (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <XCircleIcon className="mx-auto w-5 cursor-pointer text-destructive" />
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Confirm Delete</DrawerTitle>
                        <DrawerDescription>Are you sure you want to delete this comment?</DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter className="mx-auto flex-row">
                        <Button onClick={() => handleDeleteComment(comment.id!, comment.postId, comment.postType)}>
                          <CheckSquareIcon className="mr-1 w-4" />
                          Confirm
                        </Button>
                        <DrawerClose>
                          <Button variant="outline">
                            <BanIcon className="mr-1 w-4" />
                            Cancel
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                ) : (
                  <Dialog>
                    <DialogTrigger>
                      <TooltipProvider>
                        <Tooltip delayStay={0}>
                          <TooltipTrigger asChild>
                            <XCircleIcon className="mx-auto w-5 cursor-pointer text-destructive" />
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
                          <CheckSquareIcon className="mr-1 w-4" />
                          Confirm
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
}
