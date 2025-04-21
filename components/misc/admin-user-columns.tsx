"use client";

import dayjs from "dayjs";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import EditRole from "./EditRole";

import { suspendUser } from "@/app/(dashboard)/dashboard/users/[user]/actions";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { checkInstructorHasProfile } from "@/actions/userActions";


export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "Imagine",
    cell: ({ row }) => {
      const { image } = row.original;
      return (
        <Avatar>
          <AvatarImage src={image as string} alt="avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      );
    },
  },
  { accessorKey: "name", header: "Nume" },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  { accessorKey: "role", header: "Rol" },
  {
    accessorKey: "createdAt",
    header: "Creat",
    cell: ({ row }) => (
      <div>{dayjs(row.original.createdAt).format("DD-MM-YYYY : HH:mm:ss")}</div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Actualizat",
    cell: ({ row }) => (
      <div>{dayjs(row.original.updatedAt).format("DD-MM-YYYY : HH:mm:ss")}</div>
    ),
  },
  {
    accessorKey: "id",
    header: "Editează rolul",
    cell: ({ row }) => <EditRole id={row.original.id} role={row.original.role} />,
  },
  // În componenta de coloană pentru "Acțiuni" din admin-user-columns.tsx
  {
    header: "Acțiuni",
    cell: ({ row }) => {
      const { role, id, name } = row.original;
      const router = useRouter();
      
      // Funcție pentru a verifica dacă utilizatorul este instructor și are profil
      const [hasInstructorProfile, setHasInstructorProfile] = useState(false);
      
      // Verifică dacă utilizatorul instructor are deja un profil
      useEffect(() => {
        const checkInstructorProfile = async () => {
          if (role === "INSTRUCTOR") {
            try {
              // Presupunem că avem o acțiune server care verifică existența profilului
              const response = await checkInstructorHasProfile(id);
              setHasInstructorProfile(response.hasProfile);
            } catch (error) {
              console.error("Eroare la verificarea profilului instructorului:", error);
            }
          }
        };
        
        checkInstructorProfile();
      }, [id, role]);
      
      // Nu afișa nimic pentru utilizatorii ADMIN
      if (role === "ADMIN") {
        return null;
      }
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Deschide meniul</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
            
            {/* Pentru INSTRUCTOR, afișează opțiunea de adăugare profil doar dacă nu are deja profil */}
            {role === "INSTRUCTOR" && !hasInstructorProfile && (
              <DropdownMenuItem>
                <Link href={`/dashboard/users/${id}?name=${name}`}>
                  Adaugă profilul instructorului
                </Link>
              </DropdownMenuItem>
            )}
            
            {/* Separator doar dacă există opțiunea de adăugare profil */}
            {role === "INSTRUCTOR" && !hasInstructorProfile && <DropdownMenuSeparator />}
            
            {/* Opțiunea de suspendare pentru toți utilizatorii non-ADMIN */}
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={async () => {
                const confirmSuspend = confirm(`Sigur vrei să suspenzi utilizatorul ${name}?`);
                if (!confirmSuspend) return;

                try {
                  const result = await suspendUser(id);
                  if (result.success) {
                    router.refresh(); // reîncarcă pagina curentă
                    toast.success("Utilizatorul a fost suspendat cu succes");
                  } else {
                    throw new Error(result.message);
                  }
                } catch (err: any) {
                  toast.error("Eroare: " + (err?.message || "Nu s-a putut suspenda utilizatorul."));
                }
              }}
            >
              Suspendă Utilizatorul
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
}
];