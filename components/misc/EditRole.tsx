"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { BsCheckLg } from "react-icons/bs";
import { PiCaretUpDownBold } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { useState } from "react";
import { Role } from "@prisma/client";
import DialogWrapper from "../common/DialogWrapper";
import { editUser } from "@/actions/userActions";


type EditUserProps = {
  id: string;
  role: Role;
};

const EditRole = ({ id, role }: EditUserProps) => {
  const [open, setOpen] = useState(false);

  const UserRoles = ["ADMIN", "USER", "INSTRUCTOR"] as const;

  const formSchema = z.object({
    role: z.enum(UserRoles),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { role },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const valuesToAdd = {
      ...values,
      id,
    };
    try {
      await editUser(valuesToAdd);
    } catch (error) {
      toast.error("An Unexpected error occured");
    }
  }

  return (
    <DialogWrapper
      isBtn={false}
      title="Editează rolul"
      icon={CiEdit}
      open={open}
      setOpen={() => setOpen(!open)}
    >
      <div className=" bg-white p-4 rounded-md shadow-md dark:bg-black">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Selectează rolul </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            " justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? UserRoles.find((rolez) => rolez === field.value)
                            : "Selectează un rol"}
                          <PiCaretUpDownBold className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Caută un rol..." />
                        <CommandList>
                          <CommandEmpty>Nu a fost găsit niciun rol.</CommandEmpty>
                          <CommandGroup>
                            {UserRoles.map((rolez, i) => (
                              <CommandItem
                                value={rolez}
                                key={i}
                                onSelect={() => {
                                  form.setValue("role", rolez);
                                }}
                              >
                                <BsCheckLg
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    rolez === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {rolez}
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
};

export default EditRole;