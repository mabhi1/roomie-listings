import { getRoomAds } from "@/actions/room";
import Spinner from "@/components/page/Spinner";
import { useEffect, useState } from "react";
import { RoomAd, RoommateAd } from "@/lib/types";
import IndividualAd from "@/components/page/IndividualAd";

export default function RoomProfilePage({
  userId,
  tab,
}: {
  userId: string;
  tab: "reportedAds" | "savedAds" | "postedAds";
}) {
  const [ads, setAds] = useState<RoomAd[] | RoommateAd[] | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAds() {
      const ads = (await getRoomAds(userId, tab)) as RoomAd[];
      setAds(ads);
      setLoading(false);
    }
    getAds();
  }, [userId, tab]);

  if (loading)
    return (
      <div className="mt-10 flex w-full justify-center">
        <Spinner size="medium" />
      </div>
    );
  else if (!ads || ads.length === 0)
    return <div className="flex h-32 w-full items-center justify-center rounded border capitalize">No Rental Ads</div>;
  else
    return (
      <div className="flex flex-col gap-5">
        {ads.map(ad => (
          <IndividualAd ad={ad} key={ad.id} setAds={setAds} currentTab={tab} />
        ))}
      </div>
    );
}
