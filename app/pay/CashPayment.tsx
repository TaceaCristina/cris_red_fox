"use client";

import { useBookingStore } from "@/lib/store";
import { GiPayMoney } from "react-icons/gi";
import { useState } from "react";
import LoadingBtn from "@/components/common/LoadingBtn";
import { addBookings } from "./actions";
import { useRouter } from "next/navigation";

const CashPayment = ({ method }: { method: string }) => {
  const [loading, setLoading] = useState(false);

  const { bookings, resetBooking } = useBookingStore();
  const router = useRouter();

  const payMethod = method.toUpperCase();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);

      // Clear the cart and reset state first
      resetBooking();
      if (typeof window !== "undefined") {
        localStorage.removeItem("ședințe");
      }
      if (useBookingStore.persist && useBookingStore.persist.rehydrate) {
        useBookingStore.persist.rehydrate();
      }

      await addBookings({ bookings, payMethod });
      
      // Handle redirection on client side
      router.push("/user/bookings");
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-3">
        <div className="h-16 w-16 rounded-full border border-orange-300 bg-slate-300 p-2 text-slate-700 md:h-24 md:w-24">
          <GiPayMoney className="h-12 w-12 md:h-16 md:w-16" />
        </div>
        <h3>Plătește ramburs înainte de a începe ședința</h3>
      </div>
      <form onSubmit={onSubmit}>
        <LoadingBtn type="submit" className="w-full" loading={loading}>
          Continuă
        </LoadingBtn>
      </form>
    </div>
  );
};

export default CashPayment;