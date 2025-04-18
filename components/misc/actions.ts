"use server";

import prisma from "@/lib/prisma";
import { Role, BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

type EditUserArgs = {
  id: string;
  role: Role;
};

type EditBookingArgs = {
  id: string;
  status: BookingStatus;
};

export async function editUser({ id, role }: EditUserArgs) {
  try {
    await prisma.user.update({
      where: { id },
      data: { role },
    });
    revalidatePath("/dashboard/users");
    return { message: `Utilizatorul cu id-ul ${id} actualizat` };
  } catch (e) {
    return { message: `Actualizare eșuată din cauza ${e} ` };
  }
}

export async function editBooking({ id, status }: EditBookingArgs) {
  try {
    await prisma.booking.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/portal/bookings");
    return { message: `Ședința cu id-ul ${id} actualizată` };
  } catch (e) {
    return { message: `Actualizare eșuată din cauza ${e} ` };
  }
}