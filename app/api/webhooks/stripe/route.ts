import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

// Acest endpoint va fi chemat de Stripe când o plată se finalizează
export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata.userId;

    if (userId) {
      try {
        // Actualizează toate rezervările legate de acest utilizator ca fiind plătite
        await prisma.booking.updateMany({
          where: {
            userId: userId,
            paid: false, // Actualizează doar cele care încă nu sunt marcate ca plătite
          },
          data: {
            paid: true,
          },
        });

        console.log(`Plată confirmată pentru utilizatorul ${userId}`);
      } catch (error) {
        console.error("Eroare la actualizarea rezervărilor:", error);
        return NextResponse.json({ error: "Eroare la actualizarea rezervărilor" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}