import { Comment } from "@/lib/types";
import { getUserById } from "@/prisma/db/users";
import Image from "next/image";
import Link from "next/link";
import CommentButtons from "../buttons/CommentButtons";

export default async function IndividualComment({ comment, adId }: { comment: Comment; adId: string }) {
  const user = await getUserById(comment.uid);

  return (
    <div className="flex flex-col gap-2" id={comment.id}>
      <Link href={`/user/${user.uid}`} className="flex gap-2 items-center">
        <div className="rounded-full w-fit overflow-clip">
          <Image
            src={user.photo ? user.photo : "/user.png"}
            alt={user.name}
            width={40}
            height={40}
            className="w-auto h-8"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span>{user.name}</span>
          <span className="text-xs text-muted-foreground italic">
            {comment.updatedAt?.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
          </span>
        </div>
      </Link>
      <span>{comment.comment}</span>
      <CommentButtons comment={comment} adId={adId} />
    </div>
  );
}
