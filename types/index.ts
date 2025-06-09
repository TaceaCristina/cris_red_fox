import { LessonType } from "@prisma/client";

export type DateStore = {
    selectedDate: Date | null;
    setDate: (value: Date | null) => void;
    getDateData: () => Date | null;
  };
  
  export type LessonTypeTypes = {
    setLessonType: (value: string | null) => void;
    getLessonType: () => string | null;
    lessonType: string | null;
  };
  
  export type BookingToAdd = {
      date: string;
      times: Date[];
      cost: number;
      type: LessonType;
      instructorId: string;
    };
    
     export type BookingToAddType = {
      bookings: BookingToAdd[];
    };
    
    export type BookingAddActionTypes = {
      addToBooking: (item: BookingToAdd) => { message: string };
      deleteBooking: (date: string) => void;
      resetBooking: () => void;
    };