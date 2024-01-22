import { Message } from "@/lib/types";
import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import resend from "@/resend/resend";

export default async function IndividualMessage({ message }: { message: Message }) {
  const { data } = await resend.emails.get(message.messageId);
  if (!data) return <></>;
  const ad = data.html?.split("<!-- -->")[7].split("</p>")[0];
  const messageText = data.html?.split('<p style="margin-top:1.25rem;margin-bottom:1.25rem">')[1].split("</p>")[0];
  return (
    <>
      <AccordionTrigger>{messageText}</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 w-fit text-muted-foreground">
          <div>Date sent</div>
          <div>
            {new Date(data.created_at).toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}
          </div>
          <div>Ad link</div>
          <div dangerouslySetInnerHTML={{ __html: ad! }} className="hover:underline hover:underline-offset-2"></div>
        </div>
      </AccordionContent>
    </>
  );
}
