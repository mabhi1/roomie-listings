"use client";

import { RoommateAdSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { Checkbox } from "../ui/checkbox";
import useAuth from "../providers/AuthProvider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createRoommate } from "@/actions/roommate";
import ComboBox from "../ui/combo-box";
import Required from "./Required";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

export default function RoommateAdForm() {
  const [descriptionChar, setDescriptionChar] = useState(5000);
  const [date, setDate] = useState<Date | undefined>();
  const [data, setData] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [verificationOpen, setVerificationOpen] = useState(false);
  const router = useRouter();
  const currentUser = useAuth();

  const form = useForm<z.infer<typeof RoommateAdSchema>>({
    resolver: zodResolver(RoommateAdSchema),
    defaultValues: {
      title: "",
      description: "",
      address: {
        city: "",
        state: "NJ",
      },
      budget: 0,
      duration: "temporary",
      acceptTc: false,
      showEmail: false,
    },
  });

  useEffect(() => {
    if (!currentUser?.emailVerified) {
      setVerificationOpen(true);
      return;
    }
  }, [currentUser]);

  if (!currentUser) return;

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    if (description.length > 5000) return;
    setDescriptionChar(5000 - description.length);
    form.setValue("description", description, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const handleDateSelect = (value: Date | undefined) => {
    if (!value) return;
    setDate(value);
    form.setValue("moveIn", value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const onSubmit = (values: z.infer<typeof RoommateAdSchema>) => {
    setData(undefined);
    setError(undefined);

    if (!form.getValues("acceptTc")) {
      form.setError("acceptTc", { message: "Please accept terms and conditions to continue." });
      return;
    }
    if (!currentUser.emailVerified) {
      setVerificationOpen(true);
      return;
    }

    handleFormReset();

    startTransition(async () => {
      const { data, error } = await createRoommate(values, [], currentUser.uid!);
      setError(error);
      setData(data);
    });
  };

  const handleAcceptTcChecked = (checked: boolean) => {
    form.setValue("acceptTc", checked, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const handleShowEmailChecked = (checked: boolean) => {
    form.setValue("showEmail", checked, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const handleFormReset = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <div className="mb-5">
        Fields marked <Required /> are required.
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} onReset={handleFormReset} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title
                <Required />
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter title" type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                <div>Description</div>
                <span className="text-xs text-muted-foreground">{descriptionChar} characters left</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter description"
                  rows={20}
                  className="resize-none"
                  onChange={handleDescriptionChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <div className="text-sm leading-none">Location</div>
          <div className="border p-5 grid grid-cols-2 gap-5 justify-evenly rounded-md">
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel htmlFor="city">
                    City
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <ComboBox {...field} value={field.value} setValue={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">State</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="NJ" value="NJ" disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Budget
                <Required />
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter budget" type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="moveIn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Move in
                <Required />
              </FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="duration">
                Duration
                <Required />
              </FormLabel>
              <FormControl>
                <Select name="duration" defaultValue="temporary" value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration..." />
                  </SelectTrigger>
                  <SelectContent {...field}>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="showEmail"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row-reverse justify-end items-center gap-2">
                <FormLabel>Show your email in the Ad</FormLabel>
                <FormControl {...field}>
                  <Checkbox
                    name="showEmail"
                    defaultChecked={false}
                    onCheckedChange={handleShowEmailChecked}
                    checked={field.value}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceptTc"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row-reverse justify-end items-center gap-2">
                <FormLabel>
                  I have read and agree to Terms and Conditions
                  <Required />
                </FormLabel>
                <FormControl {...field}>
                  <Checkbox
                    name="acceptTc"
                    defaultChecked={false}
                    onCheckedChange={handleAcceptTcChecked}
                    checked={field.value}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-10">
          <Button className="w-full mt-5" type="submit" disabled={isPending}>
            Create Ad
          </Button>
          <Button variant="secondary" className="w-full mt-5" type="reset" disabled={isPending}>
            Reset form
          </Button>
        </div>
      </form>
      <Dialog onOpenChange={setVerificationOpen} open={verificationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verification Required!</DialogTitle>
            <DialogDescription>Please verify your email to post an Ad.</DialogDescription>
          </DialogHeader>
          <Button
            className="w-1/3"
            onClick={() => {
              try {
                sendEmailVerification(currentUser);
                toast.success("Email Verification link sent");
                setVerificationOpen(false);
              } catch (error) {
                toast.error("Error in sending link! Please try again later.");
              }
            }}
          >
            Send Verification link
          </Button>
        </DialogContent>
      </Dialog>
      {data && (
        <Dialog open={true} onOpenChange={() => setData(undefined)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-success">Congratulations!</DialogTitle>
              <DialogDescription>
                Your roommate Ad has been successfully posted. You can click the button below to go to your Ad.
              </DialogDescription>
            </DialogHeader>
            <Button
              className="w-1/4"
              onClick={() => {
                router.push(`/roommate/${data}`);
              }}
            >
              Go to Ad
            </Button>
          </DialogContent>
        </Dialog>
      )}
      {error && (
        <Dialog open={true} onOpenChange={() => setError(undefined)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive">Oops! Something went wrong</DialogTitle>
              <DialogDescription>Error in creating your Ad. Please try again later.</DialogDescription>
            </DialogHeader>
            <Button
              className="w-1/4"
              onClick={() => {
                setError(undefined);
              }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </Form>
  );
}
