"use server";

import prisma from "@/lib/prisma";
import getSession from "@/lib/getSession";
import { revalidatePath } from "next/cache";

export async function deleteTimeSlot(slotId: string) {
  try {
    const session = await getSession();
    if (!session || !session.user || session.user.role !== "INSTRUCTOR") {
      throw new Error("Neautorizat");
    }

    // Get the instructor ID for the current user
    const instructor = await prisma.instructor.findFirst({
      where: { userId: session.user.id },
    });

    if (!instructor) {
      throw new Error("Profilul instructorului nu a fost găsit");
    }

    // Verify that the time slot belongs to this instructor
    const timeSlot = await prisma.timeSlots.findFirst({
      where: {
        id: slotId,
        instructorId: instructor.id,
      },
    });

    if (!timeSlot) {
      throw new Error("Intervalul orar nu a fost găsit sau nu îți aparține");
    }

    // Delete the time slot
    await prisma.timeSlots.delete({
      where: { id: slotId },
    });

    revalidatePath("/portal");
    return { success: true, message: "Intervalul orar a fost șters cu succes" };
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      message: err.message || "A apărut o eroare la ștergerea intervalului orar",
    };
  }
} 