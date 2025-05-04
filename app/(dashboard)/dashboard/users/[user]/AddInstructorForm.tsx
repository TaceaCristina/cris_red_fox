"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { draftToMarkdown } from "markdown-draft-js";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PiCaretUpDown, PiCheck } from "react-icons/pi";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { addArrayItem, cn, removeArrayItem } from "@/lib/utils";

import toast from "react-hot-toast";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { drivingLocations } from "@/lib/dummy";
import LoadingBtn from "@/components/common/LoadingBtn";
import { InstructorSchema, InstructorValues } from "@/lib/zod-validations";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { AddInstructor } from "./actions";

// Import TextEditor dynamically to ensure it only loads on the client side
const TextEditor = dynamic(() => import("@/components/common/TextEditor"), {
    ssr: false,
    loading: () => <div className="border rounded-md px-3 py-2 min-h-[150px]">Loading editor...</div>
});

type Props = {
    userId: string;
};

const AddInstructorForm = ({ userId }: Props) => {
    // Router for navigation
    const router = useRouter();
    
    // Use a ref to track component mount status more safely
    const isMountedRef = useRef(false);
    // State for client-side rendering detection
    const [isClient, setIsClient] = useState(false);
    
    // Form initialization with default values
    const form = useForm<InstructorValues>({
        resolver: zodResolver(InstructorSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            experience: undefined,
            bio: "",
            certificate: "",
            location: "",
            dcost: "",
            lcost: "",
            transmission: undefined,
            services: "",
        }
    });

    // Initialize areas state
    const [areas, setAreas] = useState<string[]>([]);
    const [areasInput, setAreasInput] = useState("");
    
    // Set client-side state safely
    useEffect(() => {
        setIsClient(true);
        isMountedRef.current = true;
        
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const {
        handleSubmit,
        control,
        setFocus,
        setValue,
        formState: { isSubmitting },
    } = form;

    // Handle adding area safely
    const handleAddArea = () => {
        if (!areasInput.trim() || !isMountedRef.current) return;
        
        setAreas(prevAreas => [...prevAreas, areasInput.trim()]);
        setAreasInput("");
    };
    
    // Handle removing area safely
    const handleRemoveArea = (indexToRemove: number) => {
        if (!isMountedRef.current) return;
        
        setAreas(prevAreas => 
            prevAreas.filter((_, index) => index !== indexToRemove)
        );
    };

    // Form submission handler
    async function onSubmit(values: InstructorValues) {
        if (!isMountedRef.current) return;
        
        const formData = new FormData();

        // Add form values to FormData
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        try {
            const result = await AddInstructor({ formData, areas, userId });
            
            if (result.success) {
                toast.success("Profilul instructorului a fost adăugat cu succes");
                router.push("/dashboard/instructors");
            } else {
                toast.error(result.error || "A apărut o eroare la adăugarea profilului", { duration: 4000 });
            }
        } catch (error) {
            console.error("Eroare la trimiterea formularului:", error);
            toast.error("A apărut o eroare neașteptată", { duration: 4000 });
        }
    }

    // If not client-side rendered yet, show a loading indicator
    if (!isClient) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-pulse">Se încarcă formularul...</div>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[60vh] px-5">
            <Form {...form}>
                <form className="space-y-6 p-2" noValidate onSubmit={handleSubmit(onSubmit)}>
                    <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nume</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="email" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Număr de telefon</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control} 
                        name="experience"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Experiență</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Selectează anii" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Experiență</SelectLabel>
                                                <SelectItem value="zero-to-one">0-1 ani</SelectItem>
                                                <SelectItem value="two-to-four">2-4 ani</SelectItem>
                                                <SelectItem value="five-and-above">peste 5 ani</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isClient && (
                        <FormField
                            control={control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <Label onClick={() => isClient && setFocus("bio")}>Biografie</Label>
                                    <FormControl>
                                        <TextEditor
                                            onChange={(rawContent) => field.onChange(draftToMarkdown(rawContent))}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={control}
                        name="certificate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Certificat</FormLabel>
                                <FormControl>
                                    <Input placeholder="certificate" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Locație</FormLabel>
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
                                                ? drivingLocations.find(
                                                    (location) => location.value === field.value,
                                                )?.label
                                                : "Selectează o locație"} 
                                             <PiCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />  
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Caută locația..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>Nicio locație găsită.</CommandEmpty>
                                                <CommandGroup>
                                                    {drivingLocations.map((location) => (
                                                        <CommandItem
                                                            value={location.label}
                                                            key={location.value}
                                                            onSelect={() => {
                                                                setValue("location", location.value);
                                                            }}
                                                        >
                                                            {location.label}
                                                            <PiCheck
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    location.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0",
                                                                )}
                                                            />
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

                    <FormField
                        control={control}
                        name="image"
                        render={({ field: { ...fieldValues } }) => (
                            <FormItem>
                                <FormLabel>Imagine de profil</FormLabel>
                                <FormControl>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            fieldValues.onChange(file);
                                        }}
                                        onBlur={fieldValues.onBlur}
                                        name={fieldValues.name}
                                        ref={fieldValues.ref}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="dcost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preț ședință de condus (opțional)</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="lcost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preț ședință de învățare (opțional)</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> 

                    <FormField
                        control={control}
                        name="transmission"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipul de transmisie</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Selectează tipul transmisiei" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Tipul de transmisie</SelectLabel>
                                                <SelectItem value="manual">Manuală</SelectItem>
                                                <SelectItem value="automatic">Automată</SelectItem>
                                                <SelectItem value="both">Manuală și automată</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <>
                        <Label>Zona</Label>
                        <div className="grid grid-cols-3">
                            <FormItem className="col-span-2">
                                <FormControl>
                                    <Input
                                        placeholder="areas"
                                        value={areasInput}
                                        onChange={(e) => setAreasInput(e.target.value.toLowerCase())}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && areasInput.trim()) {
                                                e.preventDefault();
                                                handleAddArea();
                                            }
                                        }}
                                    />
                                </FormControl>
                                {areas.length > 0 && (
                                    <ul className="flex list-none flex-wrap gap-2 mt-2">
                                        {areas.map((value, index) => (
                                            <li key={index} className="relative">
                                                <Badge>{value}</Badge>
                                                <div className="absolute right-0 top-0 -mt-1 mr-[-8px] h-4 w-4 rounded-full bg-red-500">
                                                    <button
                                                        type="button"
                                                        className="absolute right-1 top-1 -mt-1 text-xs font-semibold text-black focus:outline-none"
                                                        onClick={() => handleRemoveArea(index)}
                                                    >
                                                        x
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </FormItem>

                            <Button 
                                onClick={handleAddArea} 
                                type="button"
                                disabled={!areasInput.trim()}
                            >
                                Adaugă zonă
                            </Button>
                        </div>
                    </>

                    {isClient && (
                        <FormField
                            control={control}
                            name="services"
                            render={({ field }) => (
                                <FormItem>
                                    <Label onClick={() => isClient && setFocus("services")}>
                                        Servicii oferite
                                    </Label>
                                    <FormControl>
                                        <TextEditor
                                            onChange={(rawContent) => field.onChange(draftToMarkdown(rawContent))}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    <LoadingBtn type="submit" loading={isSubmitting}>
                        Salvează
                    </LoadingBtn>
                </form>
            </Form>
        </ScrollArea>
    );
};

export default AddInstructorForm;