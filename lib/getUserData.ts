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

    // Pentru fiecare timeslot, elimină orele deja rezervate
    const filteredTimeslots = instructor.timeslots.map((slot) => {
      const bookingsForSlot = bookings.filter(
        (b) =>
          b.type === slot.type &&
          b.date.toISOString().slice(0, 10) === slot.date.toISOString().slice(0, 10)
      );
      const bookedTimes = bookingsForSlot.flatMap((b) => b.times.map((t) => new Date(t).getTime()));
      const availableTimes = slot.times.filter((t) => !bookedTimes.includes(new Date(t).getTime()));
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