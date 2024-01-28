type User = {
  id?: string;
  name: string;
  uid: string;
  email: string;
  phone?: string | null;
  photo?: string | null;
  provider: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type RoomAddress = {
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
  stay: "temporary" | "permanent";
  postedBy: string;
  savedBy: string[];
  reports: string[];
  showEmail: boolean;
  showPhone: boolean;
  moveIn: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

type Gallery = {
  type: string;
  name: string;
  url: string;
};

type RoomAd = {
  id?: string;
  title: string;
  description: string;
  address: RoomAddress;
  rent: number;
  stay: "temporary" | "permanent";
  gallery: Gallery[];
  postedBy: string;
  savedBy: string[];
  reports: string[];
  showEmail: boolean;
  showPhone: boolean;
  moveIn: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

type Comment = {
  id?: string;
  uid: string;
  postId: string;
  postType: "room" | "roommate";
  comment: string;
  likes: string[];
  reports: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

type Message = {
  id?: string;
  messageId: string;
  sender: string;
  receiver: string;
  attachments: string[];
};

export type { User, RoomAddress, RoommateAddress, RoommateAd, RoomAd, Comment, Message };
