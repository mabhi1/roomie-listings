import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { getMessagesByType } from "@/prisma/db/messages";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IndividualMessage from "@/components/page/IndividualMessage";
import Image from "next/image";
import messagesImage from "../../../../../public/messages.png";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function MyMessages({ params: { id } }: { params: { id: string } }) {
  const sentMessages = await getMessagesByType(id, "sent");
  const receivedMessages = await getMessagesByType(id, "received");
  return (
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading="My Messages"
        backButton
        subHeading="See your all the sent and received messages below. Ad link and sent date is provided in the description."
      />
      <div className="flex w-full justify-between gap-10">
        <div className="w-full space-y-3 md:w-4/6 md:space-y-5">
          <Tabs defaultValue="sent">
            <TabsList className="md:mb-2">
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>
            <TabsContent value="sent">
              <Accordion type="single" collapsible>
                {sentMessages && sentMessages.length > 0 ? (
                  sentMessages.map(message => (
                    <AccordionItem value={message.id} key={message.id}>
                      <IndividualMessage message={message} />
                    </AccordionItem>
                  ))
                ) : (
                  <>No Sent Messages</>
                )}
              </Accordion>
            </TabsContent>
            <TabsContent value="received">
              <Accordion type="single" collapsible>
                {receivedMessages && receivedMessages.length > 0 ? (
                  receivedMessages.map(message => (
                    <AccordionItem value={message.id} key={message.id}>
                      <IndividualMessage message={message} />
                    </AccordionItem>
                  ))
                ) : (
                  <>No Received Messages</>
                )}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
        <div className="relative hidden w-2/6 md:block">
          <Image
            src={messagesImage}
            alt="Messages"
            width={644}
            height={732}
            className="h-auto w-full"
            priority
            placeholder="blur"
          />
          <div className="absolute left-0 top-0 h-full w-full bg-white/30"></div>
        </div>
      </div>
    </FullWrapper>
  );
}
