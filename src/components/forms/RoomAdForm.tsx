"use client";

import { RoomAdSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChangeEvent, useState, useTransition } from "react";
import { zipCodeList } from "@/lib/NJStateInfo";
import { Checkbox } from "../ui/checkbox";
import { createRoom } from "@/actions/room";
import useAuth from "../providers/AuthProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Required from "./Required";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, FilePlus2Icon, RotateCcwIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { Gallery } from "@prisma/client";
import { uploadFile } from "@/firebase/firebaseDBFunctions";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import FormItemInfo from "../ui/form-item-info";

export default function RoomAdForm() {
  const [descriptionChar, setDescriptionChar] = useState(5000);
  const [date, setDate] = useState<Date | undefined>();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>();
  const [isPending, startTransition] = useTransition();
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
      stay: "both",
      acceptTc: false,
      showEmail: false,
      showPhone: false,
      propertyType: "private room",
      accomodates: 1,
      attachedBath: false,
      rentType: "monthly",
      amenities: [],
      gender: "any",
    },
  });

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

  const handleAmenitiesChecked = (checked: boolean, amenity: string) => {
    const amenities = form.getValues("amenities").filter(value => value !== amenity);
    form.setValue("amenities", checked ? [...amenities, amenity] : amenities, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const checkIfAmenityIncludes = (amenity: string) => {
    const amenities = form.getValues("amenities");
    return amenities.includes(amenity);
  };

  const handleFormReset = () => {
    setFileError(undefined);
    setFiles([]);
    form.reset();
  };

  return (
    <Form {...form}>
      <div className="mb-5 text-muted-foreground md:mb-8">
        <Required /> indicates required fields.
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} onReset={handleFormReset} className="space-y-5 md:space-y-8">
        <FormField
          control={form.control}
          name="accomodates"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-end gap-1">
                <FormLabel>
                  Accomodations needed
                  <Required />
                </FormLabel>
                <FormItemInfo>Number of people needed to accomodate the property.</FormItemInfo>
              </div>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Number of accomodations"
                  type="number"
                  autoFocus
                  onWheel={e => (e.target as HTMLElement).blur()}
                  onChange={e =>
                    form.setValue("accomodates", parseInt(e.target.value), {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-end gap-1">
                <FormLabel htmlFor="propertyType">
                  Property Type
                  <Required />
                </FormLabel>
                <FormItemInfo>Type of property you are offering.</FormItemInfo>
              </div>
              <FormControl className="flex gap-3 md:gap-5" {...field}>
                <RadioGroup
                  defaultValue="private room"
                  name="propertyType"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private room" id="private room" />
                    <Label htmlFor="private room">Private Room</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shared room" id="shared room" />
                    <Label htmlFor="shared room">Shared Room</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="house" id="house" />
                    <Label htmlFor="house">House</Label>
                  </div>
                </RadioGroup>
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
        <div className="space-y-2">
          <div className="text-sm leading-none">Address</div>
          <div className="grid grid-cols-2 gap-3 rounded-md border p-5 md:gap-5">
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
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="gender">
                Preferred Gender
                <Required />
              </FormLabel>
              <FormControl className="flex gap-3 md:gap-5" {...field}>
                <RadioGroup onValueChange={field.onChange} value={field.value}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any">Any</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                </RadioGroup>
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
                Stay period
                <Required />
              </FormLabel>
              <FormControl className="flex gap-3 md:gap-5" {...field}>
                <RadioGroup defaultValue="both" onValueChange={field.onChange} value={field.value}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="long" id="long" />
                    <Label htmlFor="long">Long</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="short" id="short" />
                    <Label htmlFor="short">Short</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both">Both</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rentType"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-end gap-1">
                <FormLabel htmlFor="rentType">
                  Rent type
                  <Required />
                </FormLabel>
                <FormItemInfo>How often you need the rent.</FormItemInfo>
              </div>
              <FormControl className="flex gap-3 md:gap-5" {...field}>
                <RadioGroup defaultValue="monthly" onValueChange={field.onChange} value={field.value}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Expected Rent
                <Required />
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={(field.value - 0).toString()}
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
          name="attachedBath"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="attachedBath">
                Attached Bath
                <Required />
              </FormLabel>
              <FormControl className="flex gap-3 md:gap-5">
                <RadioGroup
                  onValueChange={e => (e === "yes" ? field.onChange(true) : field.onChange(false))}
                  value={field.value ? "yes" : "no"}
                  defaultValue={undefined}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes">Yes</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  rows={10}
                  className="resize-none"
                  onChange={handleDescriptionChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <div className="text-sm leading-none">Additional Information</div>
          <div className="grid grid-cols-2 gap-3 rounded-md border p-5 md:gap-5">
            <FormField
              control={form.control}
              name="furnished"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="furnished">Furnished</FormLabel>
                  <FormControl className="flex gap-3 md:gap-5">
                    <RadioGroup
                      onValueChange={e => (e === "yes" ? field.onChange(true) : field.onChange(false))}
                      value={field.value === undefined ? undefined : field.value === true ? "yes" : "no"}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes">Yes</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vegetarian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="vegetarian">Vegetarian Preferred</FormLabel>
                  <FormControl className="flex gap-3 md:gap-5">
                    <RadioGroup
                      onValueChange={e => (e === "yes" ? field.onChange(true) : field.onChange(false))}
                      value={field.value === undefined ? undefined : field.value === true ? "yes" : "no"}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes">Yes</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="petFriendly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="petFriendly">Pet Friendly</FormLabel>
                  <FormControl className="flex gap-3 md:gap-5">
                    <RadioGroup
                      onValueChange={e => (e === "yes" ? field.onChange(true) : field.onChange(false))}
                      value={field.value === undefined ? undefined : field.value === true ? "yes" : "no"}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes">Yes</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smoking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="smoking">Smoking Allowed</FormLabel>
                  <FormControl className="flex flex-wrap gap-3 md:gap-5">
                    <RadioGroup onValueChange={field.onChange} value={field.value}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inside" id="inside" />
                        <Label htmlFor="inside">Allowed Inside</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="outside" id="outside" />
                        <Label htmlFor="outside">Only Outside</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel htmlFor="amenities">Amenities Included</FormLabel>
                  <FormControl className="flex flex-wrap gap-3 md:gap-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          name="gym"
                          defaultChecked={false}
                          onCheckedChange={(checked: boolean) => handleAmenitiesChecked(checked, "gym")}
                          checked={checkIfAmenityIncludes("gym")}
                        />
                        <FormLabel>Gym</FormLabel>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          name="swimming pool"
                          defaultChecked={false}
                          onCheckedChange={(checked: boolean) => handleAmenitiesChecked(checked, "swimming pool")}
                          checked={checkIfAmenityIncludes("swimming pool")}
                        />
                        <FormLabel>Swimming Pool</FormLabel>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          name="car park"
                          defaultChecked={false}
                          onCheckedChange={(checked: boolean) => handleAmenitiesChecked(checked, "car park")}
                          checked={checkIfAmenityIncludes("car park")}
                        />
                        <FormLabel>Car Park</FormLabel>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          name="laundary"
                          defaultChecked={false}
                          onCheckedChange={(checked: boolean) => handleAmenitiesChecked(checked, "laundary")}
                          checked={checkIfAmenityIncludes("laundary")}
                        />
                        <FormLabel>Laundary</FormLabel>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          name="elevator"
                          defaultChecked={false}
                          onCheckedChange={(checked: boolean) => handleAmenitiesChecked(checked, "elevator")}
                          checked={checkIfAmenityIncludes("elevator")}
                        />
                        <FormLabel>Elevator</FormLabel>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          name="club house"
                          defaultChecked={false}
                          onCheckedChange={(checked: boolean) => handleAmenitiesChecked(checked, "club house")}
                          checked={checkIfAmenityIncludes("club house")}
                        />
                        <FormLabel>Club House</FormLabel>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
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
        <div className="space-y-5">
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
        </div>
        <div className="relative flex gap-3 md:gap-5 lg:gap-10">
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="absolute -top-0 left-0 font-medium uppercase text-destructive md:-top-2">
              Form contains errors
            </div>
          )}
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
    </Form>
  );
}
