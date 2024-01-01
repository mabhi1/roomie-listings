type User = {
  id?: string;
  name: string;
  uid: string;
  email: string;
  provider: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type Address = {
  address1: string | null;
  city: string;
  state: string;
  zip: number;
};

type RoommateAd = {
  id?: string;
  title: string;
  description: string;
  address: Address;
  price: number;
  duration: "temporary" | "permanent";
  postedBy: string;
  savedBy: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

type HouseAd = {
  id?: string;
  title: string;
  description: string;
  address: Address;
  pictures: string[];
  postedBy: string;
  savedBy: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type { User, Address, RoommateAd, HouseAd };
