"use client";
import dayjs from "dayjs";
import { Booking } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { IoIosMore } from "react-icons/io";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import DialogWrapper from "../common/DialogWrapper";
import EditBooking from "./EditBooking";
type BookingWithUser = Booking & {
  user: {
    name: string | null;
    email: string;
  };
};
const InstructorBookingsColumns: ColumnDef<BookingWithUser>[] = [
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
        aria-label="Selectează rândul"
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
    header: "Data",
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
    accessorKey: "cost",
    header: "Suma plătită",
  },
  {
    header: "Taxă de administrare",
    cell: ({ row }) => {
      const { cost } = row.original;
      const adminFee = (cost * 0.23).toFixed(2);
      return <div>{adminFee}</div>;
    },
  },
  {
    header: "Salariul meu",
    cell: ({ row }) => {
      const { cost } = row.original;
      const adminFee = (cost * 0.23).toFixed(2);
      const earnings = cost - parseFloat(adminFee);
      return <div>{earnings}</div>;
    },
  },
  {
    header: "Mai multe...",
    cell: ({ row }) => {
      const { times, createdAt, updatedAt } = row.original;
      return (
        <DialogWrapper
          isBtn={false}
          icon={IoIosMore}
          descr="Intervale orare selectate"
        >
          <div className="mt-2">
            {times.map((time, index) => (
              <Badge key={index} variant="outline">
                {format(time, "HH:mm")}hrs
              </Badge>
            ))}
          </div>
          <div className="grid gap-3">
            <p>CreatLa: {dayjs(createdAt).format("DD-MM-YYYY : HH:mm:ss")}</p>
            <p>CreatLa: {dayjs(updatedAt).format("DD-MM-YYYY : HH:mm:ss")}</p>
          </div>
        </DialogWrapper>
      );
    },
  },
  {
    header: "Editează",
    cell: ({ row }) => {
      const { id, status } = row.original;
      return (
        <EditBooking id={id} status={status} />
      );
    },
  },
];
export default InstructorBookingsColumns;