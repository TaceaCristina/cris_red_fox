"use server";

import prisma from "@/lib/prisma";
import { Role, BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import getSession from "@/lib/getSession";  // Importă funcția de sesiune

type EditUserArgs = {
  id: string;
  role: Role;
};

type EditBookingArgs = {
  id: string;
  status: BookingStatus;
};

// Funcție nouă pentru a obține ID-ul utilizatorului curent
export async function getCurrentUserId() {
  const session = await getSession();
  return session?.user?.id || null;
}

export async function editUser({ id, role }: EditUserArgs) {
  try {
    // Obține utilizatorul curent
    const session = await getSession();
    
    // Verifică dacă utilizatorul este autentificat
    if (!session || !session.user) {
      throw new Error("Neautorizat");
    }
    
    // Verifică dacă utilizatorul încearcă să-și modifice propriul rol
    if (session.user.id === id) {
      throw new Error("Nu îți poți schimba propriul rol de administrator");
    }
    
    // Continuă cu actualizarea rolului dacă nu este utilizatorul curent
    await prisma.user.update({
      where: { id },
      data: { role },
    });
    
    revalidatePath("/dashboard/users");
    return { message: `User with id ${id} updated`, success: true };
  } catch (e: any) {
    // Returnează un obiect de eroare pentru a-l putea gestiona în componenta client
    return { 
      message: e.message || `Failed to update because of ${e}`,
      success: false 
    };
  }
}

export async function editBooking({ id, status }: EditBookingArgs) {
  try {
    await prisma.booking.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/portal/bookings");
    return { message: `Booking with id ${id} updated`, success: true };
  } catch (e) {
    return { message: `Failed to update because of ${e}`, success: false };
  }
}

export async function checkInstructorHasProfile(userId: string) {
  try {
    // Verifică dacă există un profil de instructor pentru acest utilizator
    const instructorProfile = await prisma.instructor.findFirst({
      where: { userId: userId }
    });
    
    return { 
      hasProfile: !!instructorProfile, 
      success: true 
    };
  } catch (error) {
    console.error("Eroare la verificarea profilului instructorului:", error);
    return { 
      hasProfile: false, 
      success: false,
      message: "Nu s-a putut verifica profilul instructorului" 
    };
  }
}