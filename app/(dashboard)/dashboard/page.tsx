import { BreadCrumbItem } from "@/components/common/bread-crumb-item";
import { getAllBookings } from "@/lib/getBookings";
import { getTimeSlots } from "@/lib/getTimeSlots";
import { AdminCharts } from "@/components/misc/AdminCharts";

export default async function AdminDashboard() {
  const bookings = await getAllBookings();
  const timeSlots = await getTimeSlots();

  return (
    <div className="space-y-6">
      <BreadCrumbItem />
      <AdminCharts bookings={bookings} timeSlots={timeSlots} />
    </div>
  );
}