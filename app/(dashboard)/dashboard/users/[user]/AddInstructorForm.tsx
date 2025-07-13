"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef, useCallback } from "react";
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
    // Flag pentru a preveni setState după unmount
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);
    // State pentru a urmări/afișa încărcarea imaginii
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [areas, setAreas] = useState<string[]>([]);
    const [areasInput, setAreasInput] = useState("");
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
    const {
        handleSubmit,
        control,
        setFocus,
        setValue,
        watch,
        formState: { isSubmitting },
    } = form;
    // Monitorizăm schimbările în câmpul de imagine
    const imageField = watch("image");

    // Handler pentru adăugarea unei zone
    const handleAddArea = useCallback(() => {
        if (areasInput.trim() && !areas.includes(areasInput.trim())) {
            setAreas(prev => [...prev, areasInput.trim()]);
            setAreasInput("");
        }
    }, [areasInput, areas]);

    // Handler pentru ștergerea unei zone
    const handleRemoveArea = useCallback((areaToRemove: string) => {
        setAreas(prev => prev.filter(area => area !== areaToRemove));
    }, []);

    // Handler pentru fișierul de imagine
    const handleImageFile = useCallback((file: File) => {
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Fișierul este prea mare. Dimensiunea maximă permisă este de 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (isMounted.current) setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setValue("image", file);
    }, [setValue]);

    // Handler pentru trimiterea formularului
    const onSubmit = useCallback(async (values: InstructorValues) => {
        if (!isMounted.current) return;
        setUploading(true);
        
        try {
            const formData = new FormData();

            // Adaugă valorile formularului în FormData
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    // Verificăm dacă e File - îl trimitem direct
                    if (key === "image" && value instanceof File) {
                        formData.append(key, value);
                    } 
                    // Pentru alte valori, le convertim la string dacă e necesar
                    else if (value !== "") {
                        formData.append(key, value.toString());
                    }
                }
            });

            // Adăugăm zonele în formData ca array de string-uri
            areas.forEach(area => {
                formData.append("areas[]", area);
            });

            const result = await AddInstructor({ formData, areas, userId });
            
            if (!isMounted.current) return;
            if (result.success) {
                toast.success("Profilul instructorului a fost adăugat cu succes");
                router.push("/dashboard/instructors");
            } else {
                toast.error(result.error || "A apărut o eroare la adăugarea profilului", { duration: 4000 });
            }
        } catch (error) {
            console.error("Eroare la trimiterea formularului:", error);
            if (isMounted.current) toast.error("A apărut o eroare neașteptată", { duration: 4000 });
        } finally {
            if (isMounted.current) setUploading(false);
        }
    }, [areas, userId, router]);

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

                    <FormField
                        control={control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Biografie</Label>
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

                    <FormField
                        control={control}
                        name="certificate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Certificat</FormLabel>
                                <FormControl>
                                    <Input placeholder="certificat" {...field}/>
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
                                    <div className="space-y-4">
                                        <div className="flex flex-col items-center gap-4 md:flex-row">
                                            <div
                                                className={`border-2 border-dashed rounded-lg p-6 w-full relative flex flex-col items-center justify-center text-center ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
                                                onDragEnter={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setDragActive(true);
                                                }}
                                                onDragLeave={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setDragActive(false);
                                                }}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setDragActive(true);
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setDragActive(false);
                                                    
                                                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                                        handleImageFile(e.dataTransfer.files[0] as File);
                                                    }
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                                                    <rect x="16" y="2" width="6" height="6" rx="1"></rect>
                                                    <circle cx="9" cy="9" r="2"></circle>
                                                    <path d="m21 15-3.4-3.4a1 1 0 0 0-1.4 0L5 22"></path>
                                                </svg>
                                                <p className="mb-1 font-medium">Trage și plasează imaginea aici sau</p>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="mt-2"
                                                    onClick={() => {
                                                        // Creează un element input de tip file și simulează click pe el
                                                        const input = document.createElement('input');
                                                        input.type = 'file';
                                                        input.accept = 'image/*';
                                                        input.onchange = (e) => {
                                                            const file = (e.target as HTMLInputElement).files?.[0];
                                                            if (file) {
                                                                handleImageFile(file);
                                                            }
                                                        };
                                                        input.click();
                                                    }}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        Selectează fișier
                                                    </span>
                                                </Button>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    PNG, JPG sau GIF (max. 2MB)
                                                </p>
                                            </div>
                                            
                                            {value instanceof File && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                                        <polyline points="14 2 14 8.0005 20 8"></polyline>
                                                    </svg>
                                                    <span className="font-medium truncate max-w-xs">{value.name}</span>
                                                    <span className="text-muted-foreground">
                                                        ({(value.size / (1024 * 1024)).toFixed(2)} MB)
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 rounded-full"
                                                        onClick={() => onChange(undefined)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M18 6 6 18"></path>
                                                            <path d="m6 6 12 12"></path>
                                                        </svg>
                                                        <span className="sr-only">Șterge</span>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <p className="text-sm text-muted-foreground mb-2">Previzualizare:</p>
                                                <div className="relative w-40 h-40 rounded-md overflow-hidden border bg-muted/20">
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Previzualizare imagine" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Câmp ascuns pentru a păstra compatibilitatea cu Field din react-hook-form */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            {...fieldValues}
                                        />
                                    </div>
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
                                                    onClick={() => handleRemoveArea(value)}
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

                    <FormField
                        control={control}
                        name="services"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Servicii oferite</Label>
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
                    
                    <div className="pt-4">
                        <LoadingBtn type="submit" loading={isSubmitting || uploading} className="w-full">
                            {uploading ? "Se salvează..." : "Salvează"}
                        </LoadingBtn>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AddInstructorForm;