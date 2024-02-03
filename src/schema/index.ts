import * as z from "zod";

export const enums = {
  propertyType: ["shared room", "private room", "house"] as const,
  stay: ["short", "long", "both"] as const,
  rentType: ["monthly", "daily", "weekly"] as const,
  smoking: ["inside", "outside", "no"] as const,
  gender: ["male", "female", "any"] as const,
};

export const RoomAdSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required." })
    .max(80, { message: "Maximum 80 characters allowed." }),
  description: z.string().trim().max(5000, { message: "Maximum 5000 characters allowed." }),
  address: z.object({
    address1: z.string().trim().max(80, { message: "Maximum 80 characters allowed." }),
    city: z.string().trim().min(1, { message: "City is required." }),
    state: z.string().trim().min(1, { message: "State is required" }),
    zip: z.string().trim().length(5, { message: "ZIP is required." }),
  }),
  rent: z.coerce.number().min(1, { message: "Rent is required." }),
  moveIn: z.coerce
    .date({ required_error: "Please enter an move in date" })
    .min(new Date(), { message: "Date must be greater than today's date" }),
  stay: z.enum(enums.stay).default("both"),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  acceptTc: z.boolean({ required_error: "Please accept terms and conditions to continue." }),
  propertyType: z.enum(enums.propertyType).default("private room"),
  accomodates: z.number().min(1, { message: "Atleast 1 person should accomodate this" }),
  attachedBath: z.boolean(),
  gender: z.enum(enums.gender).default("any"),
  rentType: z.enum(enums.rentType).default("monthly"),
  furnished: z.boolean().optional(),
  amenities: z.string().array(),
  vegetarian: z.boolean().optional(),
  smoking: z.enum(enums.smoking).optional(),
  petFriendly: z.boolean().optional(),
});

export const RoommateAdSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required." })
    .max(80, { message: "Maximum 80 characters allowed." }),
  description: z.string().trim().max(5000, { message: "Maximum 5000 characters allowed." }),
  address: z.object({
    city: z.string().trim().min(1, { message: "City is required." }),
    state: z.string().trim().min(1, { message: "State is required" }),
  }),
  rent: z.coerce.number().min(1, { message: "Rent is required." }),
  moveIn: z.coerce
    .date({ required_error: "Please enter a move in date" })
    .min(new Date(), { message: "Date must be greater than today's date" }),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  acceptTc: z.boolean({ required_error: "Please accept terms and conditions to continue." }),
  propertyType: z.enum(enums.propertyType).default("private room"),
  stay: z.enum(enums.stay).default("both"),
  accomodates: z.number().min(1, { message: "Atleast 1 person should accomodate this" }),
  attachedBath: z.boolean(),
  gender: z.enum(enums.gender).default("any"),
  rentType: z.enum(enums.rentType).default("monthly"),
  furnished: z.boolean().optional(),
  amenities: z.string().array(),
  vegetarian: z.boolean().optional(),
  smoking: z.enum(enums.smoking).optional(),
  petFriendly: z.boolean().optional(),
});
