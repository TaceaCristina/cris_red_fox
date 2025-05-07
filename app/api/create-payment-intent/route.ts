import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    // Verificăm dacă serviciul Stripe este disponibil
    if (!stripe) {
      console.error("Stripe nu este inițializat corect");
      return NextResponse.json(
        { error: "Serviciul de plată nu este disponibil momentan" },
        { status: 503 }
      );
    }

    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Neautorizat" },
        { status: 401 }
      );
    }
    
    const { bookings } = await req.json();
    
    if (!bookings || !bookings.length) {
      return NextResponse.json(
        { error: "Nu există rezervări" },
        { status: 400 }
      );
    }
    
    // Calculează suma totală din toate rezervările
    const amount = bookings.reduce(
      (sum: number, booking: any) => sum + (booking.cost * booking.times.length),
      0
    );
    
    // Creează intent de plată
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertim la bani (cenți)
      currency: "ron",
      metadata: {
        userId: session.user.id!,
        bookingsCount: bookings.length.toString(),
      },
    });
    
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Eroare la crearea intenției de plată:", error);
    
    // Returnăm un mesaj de eroare mai detaliat pentru debugging
    return NextResponse.json(
      { 
        error: "Eroare la procesarea plății", 
        details: error.message || "Eroare necunoscută"
      },
      { status: 500 }
    );
  }
}