"use client";
import dayjs from "dayjs";
import { TimeSlots } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { IoEyeOutline } from "react-icons/io5";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import DialogWrapper from "../common/DialogWrapper";

type TableInstructor = {
  name: string;
  img: string | null; // Allow null
  email?: string | null;
  phone?: string | null;
};

export const adminTimeSlotsColumns: ColumnDef<TimeSlots & TableInstructor>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Selectează tot"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selectează rând"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Tipul ședinței",
    cell: ({ row }) => {
      const { type } = row.original;
      return <Badge>{type}</Badge>;
    },
  },
  {
    accessorKey: "name",
    header: "Instructor",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creat",
    cell: ({ row }) => {
      const { createdAt } = row.original;
      const displayDate = dayjs(createdAt).format("DD-MM-YYYY : HH:mm:ss");
      return <div>{displayDate}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Actualizat",
    cell: ({ row }) => {
      const { updatedAt } = row.original;
      const displayDate = dayjs(updatedAt).format("DD-MM-YYYY : HH:mm:ss");
      return <div>{displayDate}</div>;
    },
  },
  {
    header: "Vizualizează",
    cell: ({ row }) => {
      const { times } = row.original;
      return (
        <DialogWrapper
          isBtn={false}
          icon={IoEyeOutline}
          title="Ședințe programate"
          descr="Intervale orare adăugate"
        >
          <div className="mt-2">
            {times.map((time, index) => (
              <Badge key={index} variant="outline">
                {format(time, "HH:mm")}
              </Badge>
            ))}
          </div>
        </DialogWrapper>
      );
    },
  },
];