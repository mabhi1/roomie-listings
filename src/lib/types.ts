type User = {
  id?: string;
  name: string;
  uid: string;
  email: string;
  provider: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type HouseAddress = {
  address1: string | null;
  city: string;
  state: string;
  zip: string;
};

type RoommateAddress = {
  city: string;
  state: string;
};

type RoommateAd = {
  id?: string;
  title: string;
  description: string;
  address: RoommateAddress;
  budget: number;
  duration: "temporary" | "permanent";
  postedBy: string;
  savedBy: string[];
  showEmail: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type HouseAd = {
  id?: string;
  title: string;
  description: string;
  address: HouseAddress;
  price: number;
  duration: "temporary" | "permanent";
  pictures: string[];
  postedBy: string;
  savedBy: string[];
  showEmail: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type { User, HouseAddress, RoommateAddress, RoommateAd, HouseAd };
