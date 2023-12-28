type User = {
  uid: string;
  name: string;
  email: string | null;
  emailVerified?: boolean;
  phone: string | null;
  photoURL: string | null;
  provider: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type { User };
