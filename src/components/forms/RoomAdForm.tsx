"use client";

import { RoomAdSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { zipCodeList } from "@/lib/NJStateInfo";
import { Checkbox } from "../ui/checkbox";
import { createRoom } from "@/actions/room";
import useAuth from "../providers/AuthProvider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Required from "./Required";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { BanIcon, CalendarIcon, FilePlus2Icon, LinkIcon, RotateCcwIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { Gallery } from "@prisma/client";
import { uploadFile } from "@/firebase/firebaseDBFunctions";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { isMobile } from "react-device-detect";
import Link from "next/link";

export default function RoomAdForm() {
  const [descriptionChar, setDescriptionChar] = useState(5000);
  const [date, setDate] = useState<Date | undefined>();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const [verificationOpen, setVerificationOpen] = useState(false);
  const router = useRouter();
  const { currentUser } = useAuth();

  const form = useForm<z.infer<typeof RoomAdSchema>>({
    resolver: zodResolver(RoomAdSchema),
    defaultValues: {
      title: "",
      description: "",
      address: {
        address1: "",
        city: "",
        state: "NJ",
        zip: "",
      },
      rent: 0,
      stay: "temporary",
      acceptTc: false,
      showEmail: false,
      showPhone: false,
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

  const setCityValue = (value: string) => {
    if (value === "" && form.getValues("address.city") === "") return;
    form.setValue("address.city", value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const handleZipChange = (e: ChangeEvent<HTMLInputElement>) => {
    const zipCode = e.target.value;
    if (zipCode.slice(-1) === " " || zipCode.length > 5 || isNaN(Number(zipCode))) return;
    form.setValue("address.zip", zipCode);
    if (zipCode.length === 5) {
      form.setValue("address.zip", zipCode, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      const zipFound = zipCodeList.find(z => z.zip === zipCode);
      if (zipFound) setCityValue(zipFound.City);
      else setCityValue("");
      return;
    }
    setCityValue("");
  };

  const handleDateSelect = (value: Date | undefined) => {
    if (!value) return;
    setDate(value);
    form.setValue("moveIn", value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const getFileData = async () => {
    const addedFiles: Gallery[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uniqueId = Math.random().toString(16).slice(2);
      const { url } = await uploadFile(uniqueId, file);
      addedFiles.push({ type: file.type.split("/")[0], name: uniqueId, url: url });
    }
    return addedFiles;
  };

  const onSubmit = (values: z.infer<typeof RoomAdSchema>) => {
    if (!form.getValues("acceptTc")) {
      form.setError("acceptTc", { message: "Please accept terms and conditions to continue." });
      return;
    }
    if (!currentUser.emailVerified) {
      setVerificationOpen(true);
      return;
    }

    startTransition(async () => {
      try {
        const { data, error } = await createRoom(values, [], currentUser.uid!, await getFileData());
        if (error) throw new Error();
        else {
          toast.success("Ad created successfully");
          router.replace(`/room/${data}`);
        }
      } catch (error) {
        toast.error("Error in creating Ad");
      }
    });
  };

  const handleAcceptTcChecked = (checked: boolean) => {
    form.setValue("acceptTc", checked, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const handleShowEmailChecked = (checked: boolean) => {
    form.setValue("showEmail", checked, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const handleFormReset = () => {
    setFileError(undefined);
    setFiles([]);
    form.reset();
  };

  return (
    <Form {...form}>
      <div className="mb-5 text-muted-foreground">
        <Required /> indicates required fields.
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
                <Input {...field} placeholder="Enter title" type="text" autoFocus />
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
          <div className="text-sm leading-none">Address</div>
          <div className="grid grid-cols-2 gap-5 rounded-md border p-5">
            <FormField
              control={form.control}
              name="address.address1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-20 text-right">Address 1</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter address 1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-20 text-right">
                    ZIP Code
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter zip code" onChange={handleZipChange} />
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
                  <FormLabel className="w-20 text-right">State</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="NJ" value="NJ" disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-20 text-right">
                    City
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter zip to select city" disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="rent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Rent per month
                <Required />
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter rent"
                  type="number"
                  onWheel={e => (e.target as HTMLElement).blur()}
                />
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
                Move In
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
          name="stay"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="stay">
                Stay
                <Required />
              </FormLabel>
              <FormControl>
                <Select name="stay" defaultValue="temporary" value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="stay">
                    <SelectValue placeholder="Select stay type..." />
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
        <FormItem>
          <FormLabel>Click to upload images or videos</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*, video/*"
              id="files"
              multiple
              onChange={e => {
                if (!e.target.files || e.target.files.length === 0) {
                  setFileError(undefined);
                  return;
                }
                Array.from(e.target.files).forEach(file => {
                  if (file.type.startsWith("video") && file.size > 5242880) {
                    toast.info("Video size too big. Maximum 5MB allowed");
                    setFileError("Video size too big. Maximum 5MB allowed");
                    e.target.value = "";
                    setFiles([]);
                    return;
                  } else if (!file.type.startsWith("video") && file.size > 2097152) {
                    toast.info("Image size too big. Maximum 2MB allowed");
                    setFileError("Image size too big. Maximum 2MB allowed");
                    e.target.value = "";
                    setFiles([]);
                    return;
                  } else {
                    setFiles(fileList => [...fileList, file]);
                    setFileError(undefined);
                  }
                });
              }}
            />
          </FormControl>
          {fileError && <div className="text-sm text-destructive">{fileError}</div>}
        </FormItem>
        <FormField
          control={form.control}
          name="showEmail"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row-reverse items-center justify-end gap-2">
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
              <div className="flex flex-row-reverse items-center justify-end gap-2">
                <FormLabel>
                  I have read and agree to{" "}
                  <Link href="/terms&conditions" className="text-primary underline underline-offset-2">
                    Terms and Conditions
                  </Link>
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
        <div className="flex gap-3 md:gap-5 lg:gap-10">
          <Button className="mt-5 w-full" type="submit" disabled={isPending}>
            <FilePlus2Icon className="mr-1 w-4" />
            Create Ad
          </Button>
          <Button variant="secondary" className="mt-5 w-full" type="reset" disabled={isPending}>
            <RotateCcwIcon className="mr-1 w-4" />
            Reset form
          </Button>
        </div>
      </form>
      {isMobile ? (
        <Drawer open={verificationOpen} onOpenChange={setVerificationOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Verification Required!</DrawerTitle>
              <DrawerDescription>Please verify your email to post an Ad.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="mx-auto flex-row">
              <Button
                className="w-fit"
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
                <LinkIcon className="mr-1 w-4" />
                Send Verification link
              </Button>
              <DrawerClose>
                <Button variant="outline">
                  <BanIcon className="mr-1 w-4" />
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog onOpenChange={setVerificationOpen} open={verificationOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verification Required!</DialogTitle>
              <DialogDescription>Please verify your email to post an Ad.</DialogDescription>
            </DialogHeader>
            <Button
              className="w-fit"
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
              <LinkIcon className="mr-1 w-4" />
              Send Verification link
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </Form>
  );
}
