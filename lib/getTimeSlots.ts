import getSession from "./getSession";
import prisma from "./prisma";

export async function getTimeSlots() {
  const session = await getSession();

  const userRole = session?.user?.role;

  if (userRole !== "ADMIN") {
    throw new Error("Neautorizat");
  }
  try {
    const timeSlots = await prisma.timeSlots.findMany({
      include: {
        instructor: {
          select: {
            name: true,
            img: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return timeSlots;
  } catch (error) {
    console.error("Eroare la încărcarea utilizatorilor:", error);
    throw new Error("Eroare la încărcarea utilizatorilor");
  }
}