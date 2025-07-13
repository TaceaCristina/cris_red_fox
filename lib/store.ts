import {
    BookingAddActionTypes,
    BookingToAdd,
    BookingToAddType,
    DateStore,
    LessonTypeTypes,
  } from "@/types";
  import { create } from "zustand";
  import { devtools, persist } from "zustand/middleware";
  
  export const useDateData = create<DateStore>()(
    devtools(
      persist(
        (set, get) => ({
          selectedDate: null,
          setDate: (value: Date | null) => {
            set({ selectedDate: value });
          },
  
          getDateData: () => {
            return get().selectedDate;
          },
        }),
        { name: "date_data", skipHydration: true },
      ),
    ),
  );
  
  export const useLessonTypeStore = create<LessonTypeTypes>()(
    devtools(
      persist(
        (set, get) => ({
          lessonType: null, // Initial state
  
          setLessonType: (value) => {
            set({ lessonType: value });
          },
  
          getLessonType: () => {
            return get().lessonType;
          },
        }),
        { name: "lesson_Type", skipHydration: true },
      ),
    ),
  );
  
  const INITIAL_STATE = {
    bookings: [] as BookingToAdd[],
  };
  
  export const useBookingStore = create<
    BookingToAddType & BookingAddActionTypes
  >()(
    devtools(
      persist(
        (set, get) => ({
          bookings: INITIAL_STATE.bookings,
  
          addToBooking(item) {
            const bookings = get().bookings;
            const existingBookingIndex = bookings.findIndex(
              (booking) =>
                booking.date === item.date &&
                booking.instructorId === item.instructorId &&
                booking.type === item.type
            );

            if (existingBookingIndex !== -1) {
              // Dacă există deja o rezervare pentru această dată și instructor, actualizăm intervalele orare
              const existingBooking = bookings[existingBookingIndex];
              const newTimes = [...existingBooking.times];

              // Adăugăm noi intervale orare din item.times, evitând duplicatele
              item.times.forEach(newTime => {
                // Convertim ambele date în stringuri ISO (doar ora și minutul) pentru o comparație sigură
                const newTimeISO = newTime.toISOString().slice(11, 16);
                if (!newTimes.some(existingTime => {
                  const existingTimeDate = new Date(existingTime);
                  return existingTimeDate.toISOString().slice(11, 16) === newTimeISO;
                })) {
                  newTimes.push(newTime);
                }
              });

              // Actualizăm rezervarea existentă cu intervalele orare consolidate
              const updatedBookings = [...bookings];
              updatedBookings[existingBookingIndex] = {
                ...existingBooking,
                times: newTimes,
              };
              set({ bookings: updatedBookings });
              return { message: `succes` };
            } else {
              // Dacă nu există o rezervare existentă, adăugăm noul item
              set({ bookings: [...bookings, item] });
              return { message: `succes` };
            }
          },
          deleteBooking(itemDate: string) {
            const bookings = get().bookings;
            const updatedBookings = bookings.filter(
              (booking) => booking.date !== itemDate,
            );
            set({ bookings: updatedBookings });
          },
          resetBooking() {
            console.log("Before reset - bookings:", get().bookings);
            set(INITIAL_STATE);
            console.log("After reset - bookings:", get().bookings);
          },
        }),
        { name: "ședințe", skipHydration: true },
      ),
    ),
  );