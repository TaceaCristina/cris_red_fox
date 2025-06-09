"use client";

import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LuPenLine } from "react-icons/lu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { PiCaretUpDownBold } from "react-icons/pi";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { BsCheckLg } from "react-icons/bs";
import { BookingStatus } from "@prisma/client";
import DialogWrapper from "../common/DialogWrapper";
import { editBooking } from "./actions";

export default function EditBooking({
  id,
  status,
}: {
  id: string;
  status: BookingStatus;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const BookingStatus = ["PENDING", "CANCELLED", "COMPLETED"] as const;

  const statusMap: Record<string, string> = {
    PENDING: "ÎN AȘTEPTARE",
    CANCELLED: "ANULATĂ",
    COMPLETED: "FINALIZATĂ",
  };

  const formSchema = z.object({
    status: z.enum(BookingStatus),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { status },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const valuesToAdd = {
      ...values,
      id,
    };
    try {
      const res = await editBooking(valuesToAdd);
      toast.success(`${res.message}`, { duration: 3000 });
      setIsOpen(false);
    } catch (error: unknown) {
      console.error("Error editing booking:", error);
      toast.error("An Unexpected error occured");
    }
  }

  const toggleDialog = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  return (
    <DialogWrapper
      isBtn={false}
      icon={LuPenLine}
      title="Editează programarea"
      open={isOpen}
      setOpen={toggleDialog}
    >
      <div className="rounded-md bg-white p-4 shadow-md dark:bg-black">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Selectează un status </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? statusMap[field.value]
                            : "Selectează un status"}
                          <PiCaretUpDownBold className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Caută un status..." />
                        <CommandList>
                          <CommandEmpty>Niciun status găsit.</CommandEmpty>
                          <CommandGroup>
                            {BookingStatus.map((statuz, i) => (
                              <CommandItem
                                value={statuz}
                                key={i}
                                onSelect={() => {
                                  form.setValue("status", statuz);
                                }}
                              >
                                <BsCheckLg
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    statuz === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {statusMap[statuz]}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Trimite</Button>
          </form>
        </Form>
      </div>
    </DialogWrapper>
  );
}