import { Message } from "@/lib/types";
import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import resend from "@/resend/resend";
import Link from "next/link";
import Image from "next/image";

export default async function IndividualMessage({ message }: { message: Message }) {
  const { data } = await resend.emails.get(message.messageId);
  if (!data) return <></>;
  const ad = data.html?.split("<!-- -->")[7].split("</p>")[0].split("/")!;
  const adType = ad[1];
  const adId = ad[2].split('"')[0];
  const adText = ad[2].split(">")[1].split("<")[0];
  const messageText = data.html?.split('<p style="margin-top:1.25rem;margin-bottom:1.25rem">')[1].split("</p>")[0];
  return (
    <>
      <AccordionTrigger>{messageText}</AccordionTrigger>
      <AccordionContent>
        <>
          <div className="grid grid-cols-2 w-fit text-muted-foreground">
            <div>Date sent</div>
            <div>
              {new Date(data.created_at).toLocaleDateString("en-us", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div>Ad link</div>
            <Link href={`/${adType}/${adId}`} className="hover:underline hover:underline-offset-2">
              {adText}
            </Link>
          </div>
          {message.attachments.length > 0 ? (
            <a href={message.attachments[0]} target="_blank">
              <Image
                alt={message.messageId}
                src={message.attachments[0]}
                width={1024}
                height={1024}
                priority
                className="h-40 w-40 lg:h-40 lg:w-40 xl:h-52 xl:w-52 object-cover rounded my-5"
              />
            </a>
          ) : (
            <div className="text-muted-foreground">No attachments</div>
          )}
        </>
      </AccordionContent>
    </>
  );
}
