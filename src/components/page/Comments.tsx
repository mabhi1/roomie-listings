import AddComment from "@/components/page/AddComment";
import IndividualComment from "@/components/page/IndividualComment";
import { Separator } from "@/components/ui/separator";
import { getAllCommentsByAd } from "@/prisma/db/comments";

export default async function Comments({ id }: { id: string }) {
  const comments = await getAllCommentsByAd(id);

  return (
    <div>
      <div className="flex gap-2 border-b pb-2">
        <h4>Comments</h4>
        <span className="bg-foreground text-accent px-1 rounded">{comments.length}</span>
      </div>
      <div className="flex gap-8 mt-5">
        <AddComment postId={id} />
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-5">
          {comments.map((comment) => (
            <IndividualComment key={comment.id} comment={comment} adId={id} />
          ))}
        </div>
      </div>
    </div>
  );
}
