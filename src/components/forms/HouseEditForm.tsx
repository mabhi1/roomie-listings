"use client";

import { HouseAd } from "@/lib/types";
import { HouseAdSchema } from "@/schema";
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
import { editHouse } from "@/actions/house";
import useAuth from "../providers/AuthProvider";
import { useRouter } from "next/navigation";
import Required from "./Required";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { deleteFile, uploadFile } from "@/firebase/firebaseDBFunctions";
import { Gallery } from "@prisma/client";
import Image from "next/image";

export default function HouseEditForm({ houseAd }: { houseAd: HouseAd }) {
  const [descriptionChar, setDescriptionChar] = useState(5000);
  const [date, setDate] = useState<Date>(houseAd.available);
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]);
  const [gallery, setGallery] = useState<Gallery[]>(houseAd.gallery);
  const [fileError, setFileError] = useState<string>();
  const router = useRouter();
  const currentUser = useAuth();

  const form = useForm<z.infer<typeof HouseAdSchema>>({
    resolver: zodResolver(HouseAdSchema),
    defaultValues: {
      title: houseAd.title,
      description: houseAd.description || "",
      address: {
        address1: houseAd.address.address1 || "",
        city: houseAd.address.city,
        state: "NJ",
        zip: houseAd.address.zip,
      },
      price: houseAd.price,
      available: houseAd.available,
      duration: houseAd.duration,
      acceptTc: false,
      showEmail: houseAd.showEmail,
    },
  });

  useEffect(() => {
    if (!currentUser || currentUser.uid !== houseAd.postedBy) {
      throw new Error("Unauthorized Access");
    }
  }, [currentUser, houseAd]);

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
      const zipFound = zipCodeList.find((z) => z.zip === zipCode);
      if (zipFound) setCityValue(zipFound.City);
      else setCityValue("");
      return;
    }
    setCityValue("");
  };

  const handleDateSelect = (value: Date | undefined) => {
    if (!value) return;
    setDate(value);
    form.setValue("available", value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
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

  const onSubmit = (values: z.infer<typeof HouseAdSchema>) => {
    if (!form.getValues("acceptTc")) {
      form.setError("acceptTc", { message: "Please accept terms and conditions to continue." });
      return;
    }

    startTransition(async () => {
      try {
        const originalGallery: string[] = houseAd.gallery.map((item) => JSON.stringify(item));
        const newGallery: string[] = gallery.map((item) => JSON.stringify(item));
        const notRequriedGalleryItems: Gallery[] = originalGallery
          .filter((item) => !newGallery.includes(item))
          .map((item) => JSON.parse(item));
        notRequriedGalleryItems.map(async (item) => {
          await deleteFile(item.name);
        });

        const { data, error } = await editHouse(
          houseAd.id!,
          values,
          houseAd.savedBy!,
          currentUser.uid!,
          houseAd.reports!,
          [...(await getFileData()), ...gallery]
        );
        if (error) throw new Error();
        else {
          toast.success("Ad updated successfully");
          router.push(`/house/${houseAd.id}`);
        }
      } catch (error) {
        toast.error("Error in updating ad");
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
    setGallery(houseAd.gallery);
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
          <div className="grid grid-cols-2 border p-5 gap-5 rounded-md">
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
          </div>
        </div>
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Price
                <Required />
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter price" type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Available
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
        <FormItem>
          <FormLabel>Click to upload images or videos</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*, video/*"
              id="files"
              multiple
              onChange={(e) => {
                if (!e.target.files || e.target.files.length === 0) {
                  setFileError(undefined);
                  return;
                }
                Array.from(e.target.files).forEach((file) => {
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
                    setFiles((fileList) => [...fileList, file]);
                    setFileError(undefined);
                  }
                });
              }}
            />
          </FormControl>
          {fileError && <div className="text-sm text-destructive">{fileError}</div>}
        </FormItem>
        {gallery && gallery.length > 0 && (
          <div className="space-y-2">
            <div>Gallery</div>
            <div className="grid grid-cols-2 gap-5">
              {gallery.map((item) => (
                <div key={item.name} className="relative">
                  {item.type.startsWith("video") ? (
                    <video src={item.url} controls className="h-52 w-full rounded" />
                  ) : (
                    <a href={item.url} target="_blank">
                      <Image
                        alt={item.type}
                        src={item.url}
                        width={1024}
                        height={1024}
                        priority
                        className="h-52 w-full object-cover rounded"
                      />
                    </a>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setGallery((gallery) => gallery?.filter((i) => i.url !== item.url))}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
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
            Save Ad
          </Button>
          <Button variant="secondary" className="w-full mt-5" type="reset" disabled={isPending}>
            Reset form
          </Button>
        </div>
      </form>
    </Form>
  );
}
