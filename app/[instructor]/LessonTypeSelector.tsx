"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLessonTypeStore } from "@/lib/store";

export default function LessonTypeSelector() {
  const { setLessonType, lessonType } = useLessonTypeStore();

  return (
    <div className="mx-auto my-10 flex max-w-lg p-4 rounded-md border border-orange-400">
      <h2 className=" text-lg font-semibold lg:text-2xl">
        {" "}
        Selectează tipul ședinței
      </h2>
      <Select onValueChange={(v) => setLessonType(v)}>
        <SelectTrigger className="">
          <SelectValue placeholder={lessonType} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Selectează tipul ședinței</SelectLabel>
            <SelectItem value="DRIVING">CONDUS</SelectItem>
            <SelectItem value="LEARNERS">ÎNVĂȚARE</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}