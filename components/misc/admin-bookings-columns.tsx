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
    id: "type",
    header: "Tip",
    cell: ({ row }) => {
      const typeLabel = {
        DRIVING: "CONDUS",
        LEARNERS: "ÎNVĂȚARE"
      }[row.original.type] || row.original.type;
      return <Badge className="text-xs px-2 py-1">{typeLabel}</Badge>;
    },
    meta: { className: "whitespace-nowrap" },
  },
  {
    accessorKey: "name",
    id: "name",
    header: "Utilizator",
    meta: { className: "whitespace-nowrap" },
  },
  {
    accessorKey: "email",
    id: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="hidden md:inline-block truncate max-w-[120px]">{row.original.user?.email}</span>
    ),
    meta: { className: "hidden md:table-cell" },
  },
  {
    accessorKey: "date",
    id: "date",
    header: "Data",
    cell: ({ row }) => {
      const { date } = row.original;
      const displayDate = dayjs(date).format("DD.MM.YYYY");
      return <div className="whitespace-nowrap">{displayDate}</div>;
    },
    meta: { className: "whitespace-nowrap" },
  },
  {
    accessorKey: "bookingNumber",
    id: "bookingNumber",
    header: "Numărul ședinței",
    meta: { className: "whitespace-nowrap" },
  },
  {
    accessorKey: "completed",
    id: "completed",
    header: "Status",
    cell: ({ row }) => {
      const statusLabel = {
        PENDING: "ÎN AȘTEPTARE",
        CANCELLED: "ANULATĂ",
        COMPLETED: "FINALIZATĂ"
      }[row.original.status] || row.original.status;
      return <Badge className="text-xs px-2 py-1">{statusLabel}</Badge>;
    },
    meta: { className: "whitespace-nowrap" },
  },
  {
    accessorKey: "paid",
    id: "paid",
    header: "Status plată",
    cell: ({ row }) => {
      const { paid } = row.original;
      return <div>{paid ? <MdCheck /> : <RxCross2 />}</div>;
    },
    meta: { className: "whitespace-nowrap" },
  },
  {
    accessorKey: "cost",
    id: "cost",
    header: "Cost",
    meta: { className: "whitespace-nowrap" },
  },
  {
    id: "taxaDeAdministrare",
    header: "Taxă de administrare",
    cell: ({ row }) => {
      const { cost } = row.original;
      const adminFee = (cost * 0.23).toFixed(2);
      return <div className="whitespace-nowrap">{adminFee}</div>;
    },
    meta: { className: "whitespace-nowrap" },
  },
  {
    id: "salariuInstructor",
    header: "Salariu instructor",
    cell: ({ row }) => {
      const { cost } = row.original;
      const adminFee = (cost * 0.23).toFixed(2);
      const earnings = cost - parseFloat(adminFee);
      return <div className="whitespace-nowrap">{earnings}</div>;
    },
    meta: { className: "whitespace-nowrap" },
  },
  {
    accessorKey: "paymentToken",
    id: "paymentToken",
    header: "Token plată",
    cell: ({ row }) => (
      <span className="hidden lg:inline-block truncate max-w-[80px]">{row.original.paymentToken}</span>
    ),
    meta: { className: "hidden lg:table-cell" },
  },
  {
    id: "maiMulte",
    header: "Mai multe",
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