"use server";
import { makeSlug } from "@/lib/utils";
import { nanoid } from "nanoid";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { InstructorSchema } from "@/lib/zod-validations";
import getSession from "@/lib/getSession"; // <-- asigură-te că importi corect
type AddInstructorArgs = {
  formData: FormData;
  areas: string[];
  userId: string;
};
export async function AddInstructor({
  formData,
  areas,
  userId,
}: AddInstructorArgs) {
  const values = Object.fromEntries(formData.entries());
  const {
    name,
    image,
    phone,
    email,
    certificate,
    experience,
    bio,
    services,
    dcost,
    lcost,
    transmission,
    location,
  } = InstructorSchema.parse(values);
  const slug = `${makeSlug(name)}-${nanoid(10)}`;
  let img: string | undefined;
  if (image) {
    img = `/img/instructors/${image.name}`;
  } else {
    img = undefined;
  }
  await prisma.instructor.create({
    data: {
      userId,
      slug,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      img,
      certificate: certificate?.trim(),
      experience,
      bio: bio?.trim(),
      services: services?.trim(),
      dcost: parseInt(dcost as string),
      lcost: parseInt(lcost as string),
      transmission,
      location: location?.trim(),
      areas,
    },
  });
  redirect("/dashboard/instructors");
}

export async function deleteInstructorProfile(instructorId: string) {
  try {
    const session = await getSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      throw new Error("Neautorizat");
    }
    
    // Verifică dacă instructorul există
    const instructor = await prisma.instructor.findUnique({ 
      where: { id: instructorId } 
    });
    
    if (!instructor) {
      throw new Error("Profilul instructorului nu există");
    }
    
    // Șterge mai întâi fiecare TimeSlot asociat instructorului
    await prisma.timeSlots.deleteMany({
      where: { instructorId: instructorId }
    });
    
    // Șterge profilul instructorului
    await prisma.instructor.delete({
      where: { id: instructorId }
    });
    
    return { 
      success: true, 
      message: "Profilul instructorului a fost șters cu succes" 
    };
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      message: err.message || "A apărut o eroare la ștergerea profilului instructorului"
    };
  }
}

export async function suspendUser(userId: string) {
  try {
    const session = await getSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      throw new Error("Neautorizat");
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("Utilizatorul nu există");
    }
    if (user.role === "ADMIN") {
      throw new Error("Nu poți suspenda un administrator");
    }
    // Verifică dacă utilizatorul este instructor
    if (user.role === "INSTRUCTOR") {
      // Verifică dacă există un profil de instructor și șterge-l dacă există
      const instructorProfile = await prisma.instructor.findFirst({
        where: { userId: userId }
      });
      if (instructorProfile) {
        // Șterge orice înregistrări legate de instructor
        // Șterge mai întâi fiecare TimeSlot asociat instructorului
        await prisma.timeSlots.deleteMany({
          where: { instructorId: instructorProfile.id }
        });
       
        // Apoi șterge profilul instructorului
        await prisma.instructor.delete({
          where: { id: instructorProfile.id }
        });
      }
    }
    // Șterge utilizatorul
    await prisma.user.delete({
      where: { id: userId },
    });
    return { success: true, message: "Utilizatorul a fost suspendat cu succes" };
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      message: err.message || "A apărut o eroare la suspendarea utilizatorului"
    };
  }
}