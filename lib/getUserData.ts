import { User } from "@prisma/client";
import getSession from "./getSession";
import prisma from "./prisma";

export async function getUsers(): Promise<User[]> {
  const session = await getSession();
  const userRole = session?.user?.role;

  if (userRole !== "ADMIN") {
    throw Error("Unathorized");
  }

  try {
    const users = await prisma.user.findMany({});

    return users;
  } catch (error) {
    console.error("Error fetching  users:", error);
    throw new Error("Error fetching  users");
  }
}

export async function getInstructors() {
  try {
    const instructors = await prisma.instructor.findMany({});

    return instructors;
  } catch (error) {
    console.error("Error fetching  users:", error);
    throw new Error("Error fetching  users");
  }
}

type GetUserArgs = {
  id?: string;
  email?: string;
};

export async function getUser({ id, email }: GetUserArgs) {
  const session = await getSession();
  const currentUserEmail = session?.user?.email;
  const userRole = session?.user?.role;

  if (userRole !== "ADMIN" && email !== currentUserEmail) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id }, { email }],
      },
      include: {
        instructor: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching  user:", error);
    throw new Error("Error fetching  user");
  }
}

async function fetchInstructor(where: object) {
  try {
    const instructor = await prisma.instructor.findFirst({
      where,
      include: {
        timeslots: true,
      },
    });
    if (!instructor) return null;

    // Ia toate booking-urile pentru acest instructor
    const bookings = await prisma.booking.findMany({
      where: { instructorId: instructor.id },
      select: { date: true, type: true, times: true },
    });
    // console.log("All bookings for instructor:", bookings);

    // Pentru fiecare timeslot, elimină orele deja rezervate
    const filteredTimeslots = instructor.timeslots.map((slot) => {
      const bookingsForSlot = bookings.filter(
        (b) => {
          const bookingDate = new Date(b.date);
          const slotDate = new Date(slot.date);

          // console.log(`Comparing bookingDate: ${bookingDate.toISOString()} (type: ${typeof b.date}) vs slotDate: ${slotDate.toISOString()} (type: ${typeof slot.date})`);
          // console.log(`Year match: ${bookingDate.getFullYear()} === ${slotDate.getFullYear()} -> ${bookingDate.getFullYear() === slotDate.getFullYear()}`);
          // console.log(`Month match: ${bookingDate.getMonth()} === ${slotDate.getMonth()} -> ${bookingDate.getMonth() === slotDate.getMonth()}`);
          // console.log(`Date match: ${bookingDate.getDate()} === ${slotDate.getDate()} -> ${bookingDate.getDate() === slotDate.getDate()}`);

          // Compare only the date part (year, month, day) in a timezone-agnostic way
          return b.type === slot.type &&
                 bookingDate.getFullYear() === slotDate.getFullYear() &&
                 bookingDate.getMonth() === slotDate.getMonth() &&
                 bookingDate.getDate() === slotDate.getDate();
        }
      );
      // console.log("Bookings for current slot:", bookingsForSlot);
      const bookedTimes = bookingsForSlot.flatMap((b) =>
        b.times.map((t) => {
          const date = new Date(t);
          return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        })
      );
      // console.log("Booked times for current slot:", bookedTimes);
      const availableTimes = slot.times.filter((t) => {
        const date = new Date(t);
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        return !bookedTimes.includes(formattedTime);
      });
      // console.log("Available times after filtering:", availableTimes);
      return { ...slot, times: availableTimes };
    });

    // console.log("Filtered timeslots before returning to frontend:", filteredTimeslots);
    return { ...instructor, timeslots: filteredTimeslots };
  } catch (error) {
    console.error("Error fetching instructor:", error);
    throw new Error("Error fetching instructor");
  }
}

export async function getInstructor({ id }: { id: string }) {
  return fetchInstructor({ id });
}

export async function getInstructorByUserId({ userId }: { userId: string }) {
  return fetchInstructor({ userId });
}