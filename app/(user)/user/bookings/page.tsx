import BookingCard from "./BookingCard";
import BookingsFilter from "./BookingFilter";
import { getUserBookings } from "@/lib/getBookings";

interface UserBookingsProps {
  searchParams: any;
}

const UserBookings = async ({ searchParams }: UserBookingsProps) => {
  const awaitedSearchParams = await searchParams;
  const year = awaitedSearchParams.get ? awaitedSearchParams.get('year') : awaitedSearchParams.year || "";
  const type = awaitedSearchParams.get ? awaitedSearchParams.get('type') : awaitedSearchParams.type || "";
  const bookings = await getUserBookings(year || undefined, type || undefined);

  return (
    <div className="min-h-screen flex flex-col px-2 md:px-10 py-4 bg-background">
      <BookingsFilter year={year} type={type} />
      <div className="flex-1 flex flex-col justify-start">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              name={booking.instructor.name}
              img={booking.instructor.img as string}
              phone={booking.instructor.phone as string}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserBookings;