import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookingsFilter() {
  return (
    <div className="m-auto my-10 max-w-3xl">
      <form>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger id="year">
              <SelectValue placeholder="Anul" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => (
                <SelectItem key={i} value={`${new Date().getFullYear() - i}`}>
                  {new Date().getFullYear() - i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="Selectează tipul ședinței" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Selectează tipul ședinței</SelectLabel>
                <SelectItem value="DRIVING">CONDUS</SelectItem>
                <SelectItem value="LEARNERS">ÎNVĂȚARE</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button type="submit"> Caută</Button>
        </div>
      </form>
    </div>
  );
}