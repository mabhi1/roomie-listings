import AddComment from "@/components/page/AddComment";
import IndividualComment from "@/components/page/IndividualComment";
import { Separator } from "@/components/ui/separator";
import { getAllCommentsByAd } from "@/prisma/db/comments";
import { MessageSquareDotIcon } from "lucide-react";

export default async function Comments({ id, type }: { id: string; type: "house" | "roommate" }) {
  const comments = await getAllCommentsByAd(id);

  return (
    <div>
      <div className="flex gap-2 border-b pb-2 items-center">
        <div className="flex items-center">
          <MessageSquareDotIcon className="mr-1 w-4" />
          <h4>Comments</h4>
        </div>
        <span className="bg-foreground text-accent px-1 rounded">{comments.length}</span>
      </div>
      <div className="flex flex-col md:flex-row gap-5 lg:gap-8 mt-3 md:mt-5">
        <AddComment postId={id} postType={type} />
        <Separator orientation="vertical" className="hidden md:block" />
        <div className="flex flex-col gap-5 ml-5">
          {comments.map((comment) => (
            <IndividualComment key={comment.id} comment={comment} adId={id} />
          ))}
        </div>
      </div>
    </div>
  );
}
