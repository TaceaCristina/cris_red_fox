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
import { useState, useEffect } from "react";
import { Role } from "@prisma/client";
import DialogWrapper from "../common/DialogWrapper";
import { editUser, getCurrentUserId } from "@/actions/userActions";

type EditUserProps = {
  id: string;
  role: Role;
};

// Define a type for error with optional message property
interface ErrorWithMessage {
  message?: string;
}

const EditRole = ({ id, role }: EditUserProps) => {
  const [open, setOpen] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Verifică dacă utilizatorul curent este cel care este editat
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUserId = await getCurrentUserId();
        if (currentUserId === id) {
          setIsCurrentUser(true);
        }
      } catch (error) {
        console.error("Eroare la verificarea utilizatorului curent:", error);
      }
    };
    
    checkCurrentUser();
  }, [id]);

  const UserRoles = ["ADMIN", "USER", "INSTRUCTOR"] as const;

  const formSchema = z.object({
    role: z.enum(UserRoles),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { role },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Verificare suplimentară pentru a nu permite schimbarea propriului rol
    if (isCurrentUser) {
      toast.error("Nu îți poți schimba propriul rol de administrator!");
      return;
    }
    
    setLoading(true);
    
    const valuesToAdd = {
      ...values,
      id,
    };
    
    try {
      await editUser(valuesToAdd);
      toast.success("Rolul a fost actualizat cu succes");
      setOpen(false);
    } catch (error: unknown) {
      const errorWithMessage = error as ErrorWithMessage;
      toast.error(errorWithMessage?.message || "A apărut o eroare neașteptată");
    } finally {
      setLoading(false);
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
      <div className="bg-white p-4 rounded-md shadow-md dark:bg-black">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {isCurrentUser && (
              <div className="text-red-500 text-sm font-medium p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                Nu îți poți schimba propriul rol de administrator!
              </div>
            )}
            
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
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isCurrentUser} // Dezactivează butonul dacă este utilizatorul curent
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
                                disabled={isCurrentUser} // Dezactivează selecția dacă este utilizatorul curent
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

            <Button type="submit" disabled={isCurrentUser || loading}>
              {loading ? "Se procesează..." : "Salvează"}
            </Button>
          </form>
        </Form>
      </div>
    </DialogWrapper>
  );
};

export default EditRole;