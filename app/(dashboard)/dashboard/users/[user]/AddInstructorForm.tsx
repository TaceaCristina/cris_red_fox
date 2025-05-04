"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { draftToMarkdown } from "markdown-draft-js";
import { useRouter } from "next/navigation";
import { RawDraftContentState } from "draft-js";

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
import { cn } from "@/lib/utils";

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
import { Badge } from "@/components/ui/badge";
import { AddInstructor } from "./actions";

// Import TextEditor
import dynamic from "next/dynamic";

// Importăm TextEditor folosind dynamic import pentru a evita problemele SSR
const TextEditor = dynamic(() => import("@/components/common/TextEditor"), {
  ssr: false,
  loading: () => <div className="border rounded-md px-3 py-2 min-h-[150px]">Se încarcă editorul...</div>
});

type Props = {
    userId: string;
};

const AddInstructorForm = ({ userId }: Props) => {
    // Router pentru navigare
    const router = useRouter();
    
    // Folosim un ref pentru a urmări starea componentei
    const isMountedRef = useRef(false);
    // State pentru detectarea renderizării pe client
    const [isClient, setIsClient] = useState(false);
    
    // Inițializăm formularul cu valori implicite
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

    // Inițializăm starea pentru zone
    const [areas, setAreas] = useState<string[]>([]);
    const [areasInput, setAreasInput] = useState("");
    
    // Setăm starea client-side în siguranță
    useEffect(() => {
        isMountedRef.current = true;
        setIsClient(true);
        
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

    // Gestionează adăugarea unei zone în siguranță
    const handleAddArea = () => {
        if (!areasInput.trim() || !isMountedRef.current) return;
        
        setAreas(prevAreas => [...prevAreas, areasInput.trim()]);
        setAreasInput("");
    };
    
    // Gestionează eliminarea unei zone în siguranță
    const handleRemoveArea = (indexToRemove: number) => {
        if (!isMountedRef.current) return;
        
        setAreas(prevAreas => 
            prevAreas.filter((_, index) => index !== indexToRemove)
        );
    };

    // Handler pentru trimiterea formularului
    async function onSubmit(values: InstructorValues) {
        if (!isMountedRef.current) return;
        
        const formData = new FormData();

        // Adaugă valorile formularului în FormData
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value.toString());
            }
        });

        // Adăugăm zonele în formData
        areas.forEach((area, index) => {
            formData.append(`areas[${index}]`, area);
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

    // Dacă nu suntem pe client, afișăm un indicator de încărcare
    if (!isClient) {
        return (
            <div className="flex items-center justify-center h-full w-full p-4">
                <div className="animate-pulse">Se încarcă formularul...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-background p-4">
            <Form {...form}>
                <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
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
                                        value={field.value?.toString()}
                                    >
                                        <SelectTrigger>
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
                                            onChange={(rawContent: RawDraftContentState) => 
                                                field.onChange(draftToMarkdown(rawContent))
                                            }
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
                        render={({ field: { value, onChange, ...fieldValues } }) => (
                            <FormItem>
                                <FormLabel>Imagine de profil</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            onChange(file);
                                        }}
                                        {...fieldValues}
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
                                        value={field.value?.toString()}
                                    >
                                        <SelectTrigger>
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

                    <div className="space-y-2">
                        <Label>Zona</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                                <Input
                                    placeholder="Adaugă o zonă"
                                    value={areasInput}
                                    onChange={(e) => setAreasInput(e.target.value.toLowerCase())}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && areasInput.trim()) {
                                            e.preventDefault();
                                            handleAddArea();
                                        }
                                    }}
                                />
                                {areas.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {areas.map((value, index) => (
                                            <div key={index} className="relative">
                                                <Badge className="py-1">{value}</Badge>
                                                <button
                                                    type="button"
                                                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                                                    onClick={() => handleRemoveArea(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button 
                                onClick={handleAddArea} 
                                type="button"
                                disabled={!areasInput.trim()}
                            >
                                Adaugă zonă
                            </Button>
                        </div>
                    </div>

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
                                            onChange={(rawContent: RawDraftContentState) => 
                                                field.onChange(draftToMarkdown(rawContent))
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    
                    <div className="pt-4">
                        <LoadingBtn type="submit" loading={isSubmitting} className="w-full">
                            Salvează
                        </LoadingBtn>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AddInstructorForm;