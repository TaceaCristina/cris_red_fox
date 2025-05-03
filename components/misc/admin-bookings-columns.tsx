"use client";

import dayjs from "dayjs";
import { Booking } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { RxCross2 } from "react-icons/rx";
import { MdCheck } from "react-icons/md";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import DialogWrapper from "../common/DialogWrapper";

// Ensure Booking type includes Instructor
type BookingWithInstructor = Booking & {
  instructor: { name: string; phone: string | null };
} & {
  user: {
    name: string | null;
    email: string;
  };
};

export const adminBookingsColumns: ColumnDef<BookingWithInstructor>[] = [
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
        aria-label="Selectează răndul"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Tipul lecției",
    cell: ({ row }) => {
      const { type } = row.original;
      return <Badge>{type}</Badge>;
    },
  },
  {
    accessorKey: "name",
    header: "Utilizator",
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
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const { date } = row.original;
      const displayDate = dayjs(date).format("DD.MM.YYYY");
      return <div>{displayDate}</div>;
    },
  },
  {
    accessorKey: "bookingNumber",
    header: "Numărul ședinței",
  },
  {
    accessorKey: "completed",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;

      return <Badge>{status}</Badge>;
    },
  },
  {
    accessorKey: "paid",
    header: "Status plată",
    cell: ({ row }) => {
      const { paid } = row.original;

      return <div>{paid ? <MdCheck /> : <RxCross2 />}</div>;
    },
  },
  {
    accessorKey: "cost",
    header: "Cost",
  },
  {
    header: "Taxa de administrare",
    cell: ({ row }) => {
      const { cost } = row.original;
      const adminFee = (cost * 0.23).toFixed(2);

      return <div>{adminFee}</div>;
    },
  },
  {
    header: "Salariu instructor",
    cell: ({ row }) => {
      const { cost } = row.original;
      const adminFee = (cost * 0.23).toFixed(2);
      const earnings = cost - parseFloat(adminFee);

      return <div>{earnings}</div>;
    },
  },
  {
    accessorKey: "paymentToken",
    header: "Token plată",
  },

  {
    header: "Mai multe...",
    cell: ({ row }) => {
      const { times, createdAt, updatedAt, instructor } = row.original;

      return (
        <DialogWrapper
          isBtn
          btnTitle="Mai multe..."
          title="Vezi mai multe"
          descr="Intervale orare selectate"
        >
          <div className="mt-2">
            {times.map((time, index) => (
              <Badge key={index} variant="outline">
                {format(time, "HH:mm")}
              </Badge>
            ))}
          </div>
          <div className="grid gap-3">
            <p>Instructor: {instructor.name}</p>
            <p>CreatLa: {dayjs(createdAt).format("DD-MM-YYYY : HH:mm:ss")}</p>
            <p>CreatLa: {dayjs(updatedAt).format("DD-MM-YYYY : HH:mm:ss")}</p>
          </div>
        </DialogWrapper>
      );
    },
  },
];