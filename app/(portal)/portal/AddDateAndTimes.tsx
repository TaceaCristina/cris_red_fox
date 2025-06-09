"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

import toast from "react-hot-toast";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar} from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";

import {
  Form,
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { addTimeSlotsSchema, AddTimeSlotsValues } from "@/lib/zod-validations";
import { InstructorsTimes } from "@/lib/getTime";
import LoadingBtn from "@/components/common/LoadingBtn";
import { addSlots } from "./actions";



const AddDateAndTimes = ({ instructorId }: {instructorId: string; }) => {
  const [date, setDate] = useState<Date | undefined>(new Date()); // Set the selected Date on Calendar
  const [selectedTimes, setSelectedTimes] = useState<{ [key: string]: Date[] }>(
    {},
  ); // the Data Structure will be as the following example {2024-04-26: Array(2)} 
  // Use this with scalability in mind (i.e if you plan to bulk add dates and times in the future)



  
  const handleTimeClick = (time: Date) => {
    const dateKey = format(date as Date, "yyyy-MM-dd"); //String Date Key which is kept in format as 2024-04-26
    const selectedTimesForDate = selectedTimes[dateKey] || [];
    const index = selectedTimesForDate.findIndex(
      (selectedTime) => selectedTime.getTime() === time.getTime(),
    );

    const updatedTimes = [...selectedTimesForDate];
    if (index === -1) {
      updatedTimes.push(time);
    } else {
      updatedTimes.splice(index, 1);
    }

    setSelectedTimes({
      ...selectedTimes,
      [dateKey]: updatedTimes,
    });
  };

  const selectedTimesForDate = date
    ? selectedTimes[format(date as Date, "yyyy-MM-dd")] || []
    : [];

  const defaultValues: Partial<AddTimeSlotsValues> = {
    date: date,
  };

  const form = useForm<AddTimeSlotsValues>({
    resolver: zodResolver(addTimeSlotsSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: AddTimeSlotsValues) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (
          Array.isArray(value) &&
          value.every((item) => item instanceof Date)
        ) {
          formData.append(
            key,
            JSON.stringify(value.map((item) => item.toISOString())),
          );
        } else {
          formData.append(key, value as string);
        }
      }
    });
    try {
      const res = await addSlots({ instructorId, formData });
      reset();
      toast.success(`${res.message}`, { duration: 3000 });
    } catch (error) {
      console.error(error);
      toast.error("A apărut o eroare: " + (error instanceof Error ? error.message : "necunoscută"));
    }
  } 

  return (
    <div className="my-3 bg-white px-10  py-5  dark:bg-slate-900">
      <h2 className="py-4 text-center text-2xl font-bold tracking-tight">
        Adaugă intervale orare
      </h2>
      <div>
        <p className="mb-3 font-semibold">
          Intervalele orare selectate pentru {format(date as Date, "PPP", { locale: ro })}
        </p>
        <div>
          {selectedTimesForDate.map((time, index) => (
            <Badge key={index} variant="outline">
              {format(time, "HH:mm", { locale: ro })}
            </Badge>
          ))}
        </div>
      </div>
      <Form {...form}>
        <form
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selectează tipul ședinței</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder={field.value ? (field.value === "DRIVING" ? "CONDUS" : "ÎNVĂȚARE") : "Selectează tipul ședinței"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Alege tipul ședinței</SelectLabel>
                        <SelectItem value="DRIVING">CONDUS</SelectItem>
                        <SelectItem value="LEARNERS">ÎNVĂȚARE</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Selectează tipul ședinței pentru a adăuga intervale orare.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Selectează o dată </FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild className="border-red-500">
                      <Button
                        variant={"outline"}
                        className={cn("flex-1 pl-3 text-left font-normal")}
                      >
                        {field.value ? (
                           format(field.value, "PPP", { locale: ro })
                        ) : (
                          <span>Alege o dată</span>
                        )}

                        <HiOutlineCalendarDays className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setDate(date);
                        }}
                        disabled={(date: Date) => date < new Date()}
                        initialFocus
                        locale={ro} 
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormDescription>
                  Selectează o dată pentru a adăuga intervale orare.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="times"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Intervale orare</FormLabel>
                  <FormDescription>
                    Selectează intervalele orare pentru lecția ta.
                  </FormDescription>
                </div>
                <ScrollArea className="h-48   items-center gap-3">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {InstructorsTimes.map((item, i) => (
                      <FormField
                        key={i}
                        control={form.control}
                        name="times"
                        render={({ field }) => {
                          const isChecked = field.value?.some(
                            (selectedTime: Date) =>
                              selectedTime.getTime() === item.getTime(),
                          );
                          return (
                            <FormItem
                              key={i}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    handleTimeClick(item);
                                    if (checked) {
                                      field.onChange([
                                        ...(field.value || []),
                                        item,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter(
                                          (selectedTime: Date) =>
                                            selectedTime.getTime() !==
                                            item.getTime(),
                                        ),
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.getHours().toString().padStart(2, "0")}:
                                {item.getMinutes().toString().padStart(2, "0")}{" "}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </ScrollArea>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingBtn type="submit" loading={isSubmitting}>
            Salvează
          </LoadingBtn>
        </form>
      </Form>
    </div>
  );
};
export default AddDateAndTimes;