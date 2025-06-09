"use client";

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { TimeSlots } from "@prisma/client";
  import { format } from "date-fns";
  import { ro } from "date-fns/locale";
  import {  HiOutlineEye } from "react-icons/hi2";
  import { GoTrash } from "react-icons/go";
  import { deleteTimeSlot } from "@/actions/timeSlotActions";
  import { useState } from "react";
  import { Button } from "@/components/ui/button";
  import DialogWrapper from "@/components/common/DialogWrapper";
  import { Badge } from "@/components/ui/badge";
  import toast from "react-hot-toast";
  
  const InstructorTimeSlots = ({ slots }: { slots: TimeSlots[] }) => {
    const [isDeleting, setIsDeleting] = useState(false);
  
    const handleDelete = async (slotId: string) => {
      if (confirm("Sigur doriți să ștergeți acest interval orar?")) {
        setIsDeleting(true);
        try {
          const result = await deleteTimeSlot(slotId);
          if (result.success) {
            toast.success(result.message);
            window.location.reload();
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error("A apărut o eroare la ștergerea intervalului orar");
        } finally {
          setIsDeleting(false);
        }
      }
    };
  
    const getSessionType = (type: string) => {
      switch (type) {
        case "DRIVING":
          return "CONDUS";
        case "LEARNERS":
          return "ÎNVĂȚARE";
        default:
          return type;
      }
    };
  
    return (
      <div className="my-8">
        <h2 className="py-4 text-center text-2xl font-bold tracking-tight">
          Intervale orare curente
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {slots &&
            slots?.map((slot) => (
              <Card key={slot.id}>
                <CardHeader className="p-3">
                  <CardTitle className="text-lg">
                    {format(slot.date as Date, "PPP", { locale: ro })}
                  </CardTitle>
                  <CardDescription>
                    Tip: {getSessionType(slot.type)}
                  </CardDescription>
                </CardHeader>
  
                <CardFooter className="flex justify-between">
                  <DialogWrapper
                    isBtn={false}
                    icon={HiOutlineEye}
                    title="Intervale orare"
                    descr={`Intervale orare pentru data ${format(
                      slot.date as Date,
                      "PPP",
                      { locale: ro }
                    )}`}
                  >
                    <div className="mt-2 flex flex-wrap gap-2">
                      {slot.times.map((time, index) => (
                        <Badge key={index} variant="outline">
                          {format(time, "HH:mm")}
                        </Badge>
                      ))}
                    </div>
                  </DialogWrapper>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(slot.id)}
                    disabled={isDeleting}
                  >
                    <GoTrash size={20} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    );
  };
  
  export default InstructorTimeSlots;