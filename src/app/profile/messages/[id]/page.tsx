import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { getMessagesByType } from "@/prisma/db/messages";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IndividualMessage from "@/components/page/IndividualMessage";
import Image from "next/image";

export default async function MyMessages({ params: { id } }: { params: { id: string } }) {
  const sentMessages = await getMessagesByType(id, "sent");
  const receivedMessages = await getMessagesByType(id, "received");
  return (
    <FullWrapper className="gap-5">
      <PageHeader
        heading="My Messages"
        backButton
        subHeading="See your all the sent and received messages below. Ad link and sent date is provided in the description."
      />
      <div className="w-full flex gap-10 justify-between">
        <div className="w-4/6 space-y-5">
          <Tabs defaultValue="sent">
            <TabsList className="mb-2">
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>
            <TabsContent value="sent">
              <Accordion type="single" collapsible>
                {sentMessages && sentMessages.length > 0 ? (
                  sentMessages.map((message) => (
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
                  receivedMessages.map((message) => (
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
        <div className="relative w-2/6">
          <Image src="/messages.png" alt="Messages" width={644} height={732} className="h-auto w-full" priority />
          <div className="absolute top-0 left-0 w-full bg-white/30 h-full"></div>
        </div>
      </div>
    </FullWrapper>
  );
}
