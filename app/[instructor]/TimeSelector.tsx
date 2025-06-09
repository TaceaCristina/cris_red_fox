"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBookingStore, useDateData, useLessonTypeStore } from "@/lib/store";
import { LessonType, TimeSlots } from "@prisma/client";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { format } from "date-fns";
import { ro } from "date-fns/locale";


type TimeSelectorProps = {
  timeSlots: TimeSlots[];
  user: User;
  dcost: number;
  lcost: number;
  instructorId: string;
};
const TimeSelector = ({
  timeSlots,
  user,
  dcost,
  lcost,
  instructorId,
}: TimeSelectorProps) => {
  const [selectedTimes, setSelectedTimes] = useState<{ [key: string]: Date[] }>({});
  const { selectedDate } = useDateData();
  const { lessonType } = useLessonTypeStore();
  const { addToBooking } = useBookingStore();

  const timeSlotsByType = timeSlots?.filter((slot) => slot.type === lessonType);
  const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd");
  const timesSlotsByDate = timeSlotsByType?.filter(
    (times) => format(times.date, "yyyy-MM-dd") === formattedSelectedDate,
  )[0];
  const timesToSelect = (timesSlotsByDate?.times || []).map((t) => new Date(t));

  const handleTimeClick = (time: Date) => {
    const dateKey = format(selectedDate as Date, "yyyy-MM-dd"); //String Date Key which is kept in format as 2024-04-26
    const selectedTimesForDate = selectedTimes[dateKey] || [];
    const index = selectedTimesForDate.findIndex(
      (selectedTime) => selectedTime.getTime() === time.getTime(),
    );

    const updatedTimes = [...selectedTimesForDate];
    if (index === -1) {
      updatedTimes.push(time);
    } else {
      updatedTimes.splice(index, 1);
    }

    setSelectedTimes({
      ...selectedTimes,
      [dateKey]: updatedTimes,
    });
  };

  const selectedTimesForDate = selectedDate
    ? selectedTimes[format(selectedDate as Date, "yyyy-MM-dd")] || []
    : [];

  const submitBooking = async () => {
    if (!user) {
      toast.error("Logează-te mai întâi pentru a programa o ședință", { duration: 3000 });
      return;
    }
    let cost;
    if (lessonType === "DRIVING") {
      cost = dcost;
    } else {
      cost = lcost;
    }
    const selectedTimesArray = Object.values(selectedTimes).flat();
    const correctedTimes = selectedTimesArray.map((time) => {
      const day = new Date(selectedDate);
      const fullDate = new Date(day);
      fullDate.setHours(time.getHours());
      fullDate.setMinutes(time.getMinutes());
      fullDate.setSeconds(0);
      fullDate.setMilliseconds(0);
      return fullDate;
    });
    const bookingDate = format(selectedDate, "yyyy-MM-dd");
    const item = {
      date: bookingDate,
      times: correctedTimes,
      cost,
      type: lessonType as LessonType,
      instructorId,
    };
    const result = addToBooking(item);
    if (result && result.message) {
      if (result.message === "succes") {
        toast.success("Ședință adăugată", { duration: 3000 });
      } else {
        toast.error("Vă rugăm să finalizați mai întâi rezervările din coș.", { duration: 3000 });
      }
    }
  };

  useEffect(() => {
    useBookingStore.persist.rehydrate();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-3">
      <div>
        <h3 className="text-center font-bold">Selectează intervalele orare </h3>
        {selectedDate ? (
          <ScrollArea className="h-[350px] items-center gap-3">
            {timesToSelect?.map((time, i) => (
              <Button
                key={i}
                variant="outline"
                className={`m-1 w-32 border ${
                  selectedTimesForDate.some(
                    (selectedTime) => selectedTime.getTime() === time.getTime(),
                  )
                    ? "bg-red-500 text-white"
                    : "border-red-500"
                }`}
                onClick={() => handleTimeClick(time)}
              >
                {time.getHours().toString().padStart(2, "0")}:
                {time.getMinutes().toString().padStart(2, "0")}
              </Button>
            ))}
          </ScrollArea>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            Selectează o dată din calendar pentru a vedea intervalele orare disponibile.
          </p>
        )}
      </div>

      <div className="space-y-5">
        <p className="font-bold">
          Data și intervalele orare selectate sunt după cum urmează:
          <br />
          <span className="text-red-600">
            {" "}
            {selectedDate ? format(selectedDate, "PPP", { locale: ro }) : "-"}
          </span>
        </p>
        <div>
          {selectedTimesForDate.map((time, index) => (
            <Badge key={index} variant="outline">
              {format(time, "HH:mm")}
            </Badge>
          ))}
        </div>
        <Button
          disabled={selectedTimesForDate.length === 0}
          onClick={submitBooking}
        >
          Programează
        </Button>
      </div>
    </div>
  );
};

export default TimeSelector;