import AddComment from "@/components/page/AddComment";
import IndividualComment from "@/components/page/IndividualComment";
import { Separator } from "@/components/ui/separator";
import { getAllCommentsByAd } from "@/prisma/db/comments";
import { MessageSquareDotIcon } from "lucide-react";

export default async function Comments({ id, type }: { id: string; type: "house" | "roommate" }) {
  const comments = await getAllCommentsByAd(id);

  return (
    <div>
      <div className="flex items-center gap-2 border-b pb-2">
        <div className="flex items-center">
          <MessageSquareDotIcon className="mr-1 w-4" />
          <h4>Comments</h4>
        </div>
        <span className="rounded bg-foreground px-1 text-accent">{comments.length}</span>
      </div>
      <div className="mt-3 flex flex-col gap-5 md:mt-5 md:flex-row lg:gap-8">
        <AddComment postId={id} postType={type} />
        <Separator orientation="vertical" className="hidden md:block" />
        <div className="ml-5 flex flex-col gap-5">
          {comments.map(comment => (
            <IndividualComment key={comment.id} comment={comment} adId={id} />
          ))}
        </div>
      </div>
    </div>
  );
}
