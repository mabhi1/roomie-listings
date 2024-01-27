import { Comment } from "@/lib/types";
import { getUserById } from "@/prisma/db/users";
import Image from "next/image";
import CommentButtons from "../buttons/CommentButtons";
import userImage from "../../../public/user.png";

export default async function IndividualComment({ comment, adId }: { comment: Comment; adId: string }) {
  const user = await getUserById(comment.uid);

  return (
    <div className="flex flex-col gap-1 md:gap-2" id={comment.id}>
      <div className="flex items-center gap-2">
        <div className="w-fit overflow-clip rounded-full">
          <Image
            src={user.photo ? user.photo : userImage}
            alt={user.name}
            width={40}
            height={40}
            className="h-[35px] w-[35px] object-cover"
            priority
            placeholder="blur"
            blurDataURL={user.photo ? user.photo : ""}
          />
        </div>
        <div className="flex flex-col">
          <span>{user.name}</span>
          <span className="text-xs italic text-muted-foreground">
            {comment.updatedAt?.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
          </span>
        </div>
      </div>
      <span>{comment.comment}</span>
      <CommentButtons comment={comment} adId={adId} />
    </div>
  );
}
