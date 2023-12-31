type User = {
  id?: string;
  name: string;
  uid: string;
  email: string;
  provider: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type RoommateAd = {
  id?: string;
  title: string;
  description: string;
  address?: string;
  pictures: string[];
  price: number;
  postedBy: string;
  savedBy: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

type HouseAd = {
  id?: string;
  title: string;
  description: string;
  address?: string;
  pictures: string[];
  postedBy: string;
  savedBy: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type { User, RoommateAd, HouseAd };
