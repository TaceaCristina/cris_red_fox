"use client";
import dayjs from "dayjs";
import { Instructor } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { MdCheck } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { deleteInstructorProfile } from "@/app/(dashboard)/dashboard/users/[user]/actions";
export const instructorColumns: ColumnDef<Instructor>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "img",
    header: "Imagine",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.img as string} alt="avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "nume",
    header: "Instructor",
  },
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
  {
    accessorKey: "activ",
    header: "Status activ",
    cell: ({ row }) => (
      <div>{row.original.active ? <MdCheck /> : <RxCross2 />}</div>
    ),
  },
  {
    accessorKey: "creatLa",
    header: "Creat",
    cell: ({ row }) => (
      <div>{dayjs(row.original.createdAt).format("DD-MM-YYYY : HH:mm:ss")}</div>
    ),
  },
  {
    accessorKey: "actualizatLa",
    header: "Actualizat",
    cell: ({ row }) => (
      <div>{dayjs(row.original.updatedAt).format("DD-MM-YYYY : HH:mm:ss")}</div>
    ),
  },
  {
    id: "acțiuni",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Deschide meniul</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={async () => {
              if (confirm("Sigur doriți să ștergeți acest profil de instructor?")) {
                const result = await deleteInstructorProfile(row.original.id);
                if (result.success) {
                  alert(result.message);
                  // Reîmprospătează pagina pentru a reflecta modificările
                  window.location.reload();
                } else {
                  alert(result.message);
                }
              }
            }}
          >
            Șterge profilul
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];