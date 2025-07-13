import getSession from "./getSession";
import prisma from "./prisma";

export async function getUserBookings(year?: string, type?: string) {
    const session = await getSession();
    const user = session?.user;
    const userId = session?.user?.id as string;
  
    if (!user) {
      throw Error("Neautorizat");
    }
  
    try {
      const whereClause: any = {
        userId,
      };
      if (year) {
        // presupunem că există un câmp 'date' de tip Date în booking
        const startDate = new Date(Number(year), 0, 1);
        const endDate = new Date(Number(year) + 1, 0, 1);
        whereClause.date = {
          gte: startDate,
          lt: endDate,
        };
      }
      if (type) {
        whereClause.type = type;
      }
      const bookings = await prisma.booking.findMany({
        where: whereClause,
        include: {
          instructor: {
            select: {
              name: true,
              img: true,
              phone: true,
            },
          },
        },
      });
  
      return bookings;
    } catch (error) {
      console.error("Error fetching  bookings:", error);
      throw new Error("Error fetching  bookings");
    }
  }

  export async function getAllBookings() {
    const session = await getSession();
    const userRole = session?.user?.role;
  
    if (userRole !== "ADMIN") {
      throw new Error("Neautorizat");
    }
  
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          instructor: {
            select: {
              name: true,
              phone: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
  
      return bookings;
    } catch (error) {
      console.error("Error fetching  bookings:", error);
      throw new Error("Error fetching  bookings");
    }
  }
  
  export async function getInstructorBookings() {
    const session = await getSession();
    const userRole = session?.user?.role;
    const userId = session?.user?.id;
  
    if (userRole !== "INSTRUCTOR") {
      throw new Error("Neautorizat");
    }
  
    try {
      const instructor = await prisma.instructor.findFirst({
        where: {
          userId,
        },
      });
      const instructorId = instructor?.id;
      const bookings = await prisma.booking.findMany({
        where: { instructorId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
  
      return bookings;
    } catch (error) {
      console.error("Error fetching  bookings:", error);
      throw new Error("Error fetching  bookings");
    }
  }