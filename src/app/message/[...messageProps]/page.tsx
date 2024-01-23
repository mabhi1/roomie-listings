import MessageForm from "@/components/forms/MessageForm";
import FullWrapper from "@/components/page/FullWrapper";
import PageHeader from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getHouseById } from "@/prisma/db/houseAds";
import { getRoommateById } from "@/prisma/db/roommaateAds";
import { getUserById } from "@/prisma/db/users";
import Image from "next/image";
import Link from "next/link";

export default async function SendMessage({ params: { messageProps } }: { params: { messageProps: string[] } }) {
  if (messageProps.length !== 4) throw new Error("Invalid Request");
  const sender = await getUserById(messageProps[0]);
  if (!sender) throw new Error("Invalid Request");
  const receiver = await getUserById(messageProps[1]);
  if (!receiver) throw new Error("Invalid Request");
  const type = messageProps[2];
  if (!["house", "roommate"].includes(type)) throw new Error("Invalid Request");
  const ad = type === "house" ? await getHouseById(messageProps[3]) : await getRoommateById(messageProps[3]);
  if (!ad) throw new Error("Invalid Request");

  return (
    <FullWrapper className="gap-5">
      <PageHeader
        heading="Send Message"
        subHeading="Submit the form below to send an enquiry email. Following details will be send along with your message"
      />

      <Table className="border">
        <TableHeader className="h-6">
          <TableRow className="bg-muted/50">
            <TableHead className="font-normal text-accent-foreground h-8">Ad Title</TableHead>
            <TableHead className="text-center font-normal text-accent-foreground h-8">Ad Type</TableHead>
            <TableHead className="text-center font-normal text-accent-foreground h-8">Your Name</TableHead>
            <TableHead className="text-center font-normal text-accent-foreground h-8">Your Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-inherit">
            <TableCell className="border-b py-2">
              <Link href={`/${type}/${ad.id}`} className="block overflow-hidden w-[200px] lg:w-[600px]">
                <Button variant="link" className="h-8 p-0">
                  {ad.title}
                </Button>
              </Link>
            </TableCell>
            <TableCell className="border-b text-center py-2 capitalize">{type}</TableCell>
            <TableCell className="border-b text-center py-2">{sender.name}</TableCell>
            <TableCell className="border-b text-center py-2">{sender.email}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="w-full flex gap-10 justify-between">
        <div className="w-1/2 space-y-5">
          <MessageForm sender={sender} receiver={receiver} type={type} ad={ad} />
        </div>
        <div className="relative w-1/2 pt-10">
          <Image
            src="/send-email.png"
            alt="Send an email"
            width={1003}
            height={900}
            className="h-auto w-auto"
            priority
          />
          <div className="absolute top-0 left-0 w-full bg-white/30 h-full"></div>
        </div>
      </div>
    </FullWrapper>
  );
}
