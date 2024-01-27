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
import sendEmailImage from "../../../../public/send-email.png";

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
    <FullWrapper className="gap-3 md:gap-5">
      <PageHeader
        heading="Send Message"
        subHeading="Submit the form below to send an enquiry email. Following details will be send along with your message"
      />

      <Table className="border">
        <TableHeader className="h-6">
          <TableRow className="bg-muted/50">
            <TableHead className="h-8 font-normal text-accent-foreground">Ad Title</TableHead>
            <TableHead className="h-8 text-center font-normal text-accent-foreground">Ad Type</TableHead>
            <TableHead className="h-8 text-center font-normal text-accent-foreground">Your Name</TableHead>
            <TableHead className="h-8 text-center font-normal text-accent-foreground">Your Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-inherit">
            <TableCell className="border-b py-2">
              <Link href={`/${type}/${ad.id}`} className="block w-[260px] overflow-hidden lg:w-[400px] xl:w-[600px]">
                <Button variant="link" className="h-8 p-0">
                  {ad.title}
                </Button>
              </Link>
            </TableCell>
            <TableCell className="border-b py-2 text-center capitalize">{type}</TableCell>
            <TableCell className="block min-w-24 py-2 text-center md:table-cell">{sender.name}</TableCell>
            <TableCell className="border-b py-2 text-center">{sender.email}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="flex w-full justify-between gap-10">
        <div className="w-full space-y-5 md:w-1/2">
          <MessageForm sender={sender} receiver={receiver} type={type} ad={ad} />
        </div>
        <div className="relative hidden w-1/2 pt-10 md:block">
          <Image
            src={sendEmailImage}
            alt="Send an email"
            width={1003}
            height={900}
            className="h-auto w-auto"
            priority
            placeholder="blur"
          />
          <div className="absolute left-0 top-0 h-full w-full bg-white/30"></div>
        </div>
      </div>
    </FullWrapper>
  );
}
