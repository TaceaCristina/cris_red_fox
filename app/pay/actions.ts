"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateBookingNumber, generatePaymentToken } from "@/lib/utils";
import { BookingToAdd } from "@/types";
import { PaymentMethod } from "@prisma/client";
import { redirect } from "next/navigation";
import { Knock } from "@knocklabs/node";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";

const knock = new Knock(process.env.KNOCK_SECRET_KEY);

type AddBookingArgs = {
  bookings: BookingToAdd[];
  payMethod: string;
};

const getPaymentMethod = (payMethod: string): PaymentMethod => {
  switch (payMethod) {
    case "CARD":
      return PaymentMethod.CARD;
    case "CASH":
      return PaymentMethod.CASH;
    default:
      return PaymentMethod.CARD;
  }
};

export async function addBookings({ bookings, payMethod }: AddBookingArgs) {
  const session = await auth();
  const user = session?.user;
  const userId = session?.user?.id as string; // The person who is currently logged in

  if (!user) {
    throw new Error("Neautorizat");
  }

  // Dacă este plată cu cardul, verificăm dacă există un payment intent în proces
  const paymentMethod = getPaymentMethod(payMethod);
  
  const modifiedBookings = [];
  const instructorIds = new Set<string>(); // Use Set for efficient unique values

  for (const booking of bookings) {
    // Verificăm că avem instructorId
    if (!booking.instructorId) {
      console.error("Lipsește instructorId pentru o rezervare", booking);
      throw new Error("Date incomplete pentru rezervare. Lipsește instructorId.");
    }

    const timesToRemove = booking.times.map((time) => new Date(time));
    
    const instructorTimeSlots = await prisma.timeSlots.findFirst({
      where: {
        instructorId: booking.instructorId,
        date: new Date(booking.date), // Convert date string to Date object
      },
    });

    if (instructorTimeSlots) {
      const updatedTimes = instructorTimeSlots.times.filter(
        (time) =>
          !timesToRemove.some(
            (removeTime) => removeTime.getTime() === time.getTime(),
          ),
      );

      // Update the instructorTimeSlots with the filtered times to remove already selected times
      await prisma.timeSlots.update({
        where: { id: instructorTimeSlots.id },
        data: { times: updatedTimes },
      });
      // console.log(`Updated times for slot ${instructorTimeSlots.id}:`, updatedTimes);
    }

    // Pentru plata cu cardul, inițial marcăm ca neplătit și va fi actualizat de webhook
    // Doar plățile în numerar sunt marcate imediat ca plătite
    const isPaid = paymentMethod === PaymentMethod.CASH;

    // Modify each booking object before inserting into the database
    const modifiedBooking = {
      ...booking,
      instructorId: booking.instructorId,
      bookingNumber: generateBookingNumber(),
      paymentToken: generatePaymentToken(),
      paymentMethod: paymentMethod,
      cost: booking.cost * booking.times.length,
      paid: isPaid, // Inițial false pentru plățile cu cardul
      userId,
      date: new Date(booking.date), // Convert date string to Date object
    };
    
    // Verificăm că obiectul conține toate câmpurile necesare
    const requiredFields = ['instructorId', 'date', 'times', 'cost', 'type', 'userId'];
    for (const field of requiredFields) {
      if (!(field in modifiedBooking)) {
        console.error(`Câmpul ${field} lipsește din rezervare`, modifiedBooking);
        throw new Error(`Date incomplete pentru rezervare. Lipsește ${field}.`);
      }
    }
    
    instructorIds.add(booking.instructorId);
    modifiedBookings.push(modifiedBooking);
  }

  console.log("Bookings to create:", modifiedBookings);

  try {
    // Insert modified bookings into the database
    await prisma.booking.createMany({
      data: modifiedBookings,
    });

    // Revalidate the instructor's page to show updated time slots
    // Removed as it was causing unintended redirect/revalidation for the user.
    // for (const instructorId of instructorIds) {
    //   revalidatePath(`/instructor?id=${instructorId}`);
    // }

  } catch (error) {
    console.error("Eroare la crearea rezervărilor:", error);
    throw new Error("Nu s-au putut crea rezervările. Verificați datele și încercați din nou.");
  }

  // Notifications object
  const recipients: {
    id: string;
    name: string;
    email: string;
  }[] = [];

  // Find instructors where instructor.id is found in instructorIds[]
  // then find users associtated with each instructor for you to be able to show notification to the user
  const instructors = await prisma.instructor.findMany({
    where: {
      id: { in: Array.from(instructorIds) }, // Convert Set to array for prisma query
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  
  // Loop through each instructor and prepare recipient data
  for (const instructor of instructors) {
    recipients.push({
      id: instructor.user.id,
      name: instructor.user.name as string,
      email: instructor.user.email as string,
    });
  }

  if (recipients.length > 0) {
    try {
      await knock.workflows.trigger("sedinta-programata", {
        actor: {
          id: userId,
          name: session?.user?.name ?? "Anonymous",
          email: session?.user?.email,
          collection: "users",
        },
        recipients,
        data: {},
      });
    } catch (notificationError) {
      console.error("Eroare la trimiterea notificărilor:", notificationError);
      // Nu întrerupem fluxul dacă notificările eșuează
    }
  }

  // Redirecționăm utilizatorul către pagina de rezervări
  // redirect("/user/bookings");
}

export async function createPaymentIntent(bookings: BookingToAdd[]) {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error("Neautorizat");
  }
  
  // Calculează suma totală din toate rezervările
  const amount = bookings.reduce(
    (sum: number, booking: any) => sum + (booking.cost * booking.times.length),
    0
  );
  
  try {
    // Creează intent de plată
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertim la bani (cenți)
      currency: "ron",
      metadata: {
        userId: session.user.id || '',
        bookingsCount: bookings.length.toString(),
      },
    });
    
    return { clientSecret: paymentIntent.client_secret };
  } catch (error: any) {
    console.error("Eroare la crearea intenției de plată:", error);
    throw new Error(`Eroare la procesarea plății: ${error.message || "Eroare necunoscută"}`);
  }
}