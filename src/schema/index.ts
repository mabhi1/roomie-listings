import { Duration } from "@prisma/client";
import * as z from "zod";

export const HouseAdSchema = z.object({
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
  price: z.coerce.number().min(1, { message: "Price is required." }),
  available: z.coerce
    .date({ required_error: "Please enter an available date" })
    .min(new Date(), { message: "Date must be greater than today's date" }),
  duration: z.enum([Duration.permanent, Duration.temporary]).default("temporary"),
  showEmail: z.boolean().default(false),
  acceptTc: z.boolean({ required_error: "Please accept terms and conditions to continue." }),
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
  budget: z.coerce.number().min(1, { message: "Price is required." }),
  moveIn: z.coerce
    .date({ required_error: "Please enter a move in date" })
    .min(new Date(), { message: "Date must be greater than today's date" }),
  duration: z.enum([Duration.permanent, Duration.temporary]).default("temporary"),
  showEmail: z.boolean().default(false),
  acceptTc: z.boolean({ required_error: "Please accept terms and conditions to continue." }),
});
