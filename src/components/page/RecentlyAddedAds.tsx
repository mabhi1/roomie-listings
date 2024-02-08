import { getAllRoomAds } from "@/prisma/db/roomAds";

export const dynamic = "force-dynamic";

export default async function RecentlyAddedAds({ type }: { type: "room" | "roommate" }) {
  const rentals = await getAllRoomAds();
  return (
    <>
      {rentals.map(rental => (
        <div key={rental.id}>
          <div>{rental.title}</div>
        </div>
      ))}
    </>
  );
}
