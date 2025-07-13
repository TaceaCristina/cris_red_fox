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
    <div className="mx-4 md:mx-10">
      <BookingsFilter year={year} type={type} />
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
  );
};

export default UserBookings;