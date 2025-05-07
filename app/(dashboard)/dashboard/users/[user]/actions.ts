"use server";
import { makeSlug } from "@/lib/utils";
import { nanoid } from "nanoid";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { InstructorSchema } from "@/lib/zod-validations";
import getSession from "@/lib/getSession";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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
  try {
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
    
    // Tratăm încărcarea imaginii
    if (image && image instanceof File) {
      // Generăm un nume unic pentru fișier pentru a evita conflictele
      const uniqueFileName = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
      
      // Definim calea unde vom salva imaginea
      const uploadDir = path.join(process.cwd(), 'public', 'img', 'instructors');
      const imagePath = path.join(uploadDir, uniqueFileName);
      
      try {
        // Ne asigurăm că directorul există
        await mkdir(uploadDir, { recursive: true });
        
        // Citim datele din fișierul încărcat
        const buffer = await image.arrayBuffer();
        
        // Scriem fișierul în sistem
        await writeFile(imagePath, Buffer.from(buffer));
        
        // Setăm calea relativă pentru baza de date
        img = `/img/instructors/${uniqueFileName}`;
      } catch (fileError) {
        console.error("Eroare la salvarea imaginii:", fileError);
        throw new Error("Nu s-a putut salva imaginea. Vă rugăm încercați din nou.");
      }
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
    
    // În loc să redirecționezi direct, returnează un rezultat de succes
    return { success: true };
  } catch (error) {
    console.error("Eroare la adăugarea instructorului:", error);
    // Returnează eroarea pentru a fi gestionată pe client
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "A apărut o eroare la adăugarea profilului instructorului" 
    };
  }
}

// Add the missing function for deleting instructor profile
export async function deleteInstructorProfile(instructorId: string) {
  try {
    // First, delete all time slots associated with the instructor
    await prisma.timeSlots.deleteMany({
      where: {
        instructorId: instructorId,
      },
    });

    // Then delete the instructor profile from the database
    await prisma.instructor.delete({
      where: {
        id: instructorId,
      },
    });

    return { 
      success: true, 
      message: "Profilul instructorului a fost șters cu succes" 
    };
  } catch (error) {
    console.error("Eroare la ștergerea profilului instructorului:", error);
    return { 
      success: false, 
      message: "A apărut o eroare la ștergerea profilului instructorului" 
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