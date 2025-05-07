"use client";

import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { useBookingStore } from "@/lib/store";
import LoadingBtn from "@/components/common/LoadingBtn";
import { addBookings } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, AlertCircle } from "lucide-react";

// Componenta Stripe Card Wrapper
export const StripeCardPaymentWrapper = ({ method }: { method: string }) => {
  const [stripeError, setStripeError] = useState<string | null>(null);
  const stripePromise = getStripe();

  useEffect(() => {
    // Verificăm dacă cheia publică Stripe este disponibilă
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setStripeError("Configurația Stripe lipsește. Contactați administratorul.");
    }
  }, []);

  if (stripeError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{stripeError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeCardPaymentForm method={method} />
    </Elements>
  );
};

// Componenta de formular Stripe Card
const StripeCardPaymentForm = ({ method }: { method: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { bookings, resetBooking } = useBookingStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const payMethod = method.toUpperCase();

  useEffect(() => {
    // Creează intent de plată când componenta se încarcă
    if (bookings.length > 0) {
      setLoading(true);
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookings }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Eroare server: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setClientSecret(data.clientSecret);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Eroare:", err);
          setError(`A apărut o eroare la inițializarea plății: ${err.message}`);
          setLoading(false);
        });
    }
  }, [bookings]);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe nu s-a încărcat. Reîncărcați pagina sau încercați mai târziu.");
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Eroare la încărcarea elementului de card.");
      setLoading(false);
      return;
    }

    try {
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentError) {
        setError(paymentError.message || "A apărut o eroare la procesarea plății.");
      } else if (paymentIntent.status === "succeeded") {
        setSucceeded(true);
        // Adaugă rezervări în baza de date
        await addBookings({ bookings, payMethod });
        resetBooking();
      }
    } catch (err: any) {
      console.error("Eroare la procesarea plății:", err);
      setError(`A apărut o eroare neașteptată: ${err.message || "Eroare necunoscută"}`);
    }

    setLoading(false);
  };

  if (succeeded) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-700">
          Plata a fost procesată cu succes! Vă redirecționăm către rezervările dvs...
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-element">Detalii card</Label>
              <div className="mt-1 border rounded-md p-3">
                <CardElement id="card-element" options={cardStyle} />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <LoadingBtn 
        type="submit" 
        disabled={!stripe || loading || !clientSecret} 
        loading={loading} 
        className="w-full"
      >
        {loading ? "Se procesează..." : `Plătește ${bookings.reduce((sum, booking) => sum + (booking.cost * booking.times.length), 0)} RON`}
      </LoadingBtn>
    </form>
  );
};

export default StripeCardPaymentWrapper;