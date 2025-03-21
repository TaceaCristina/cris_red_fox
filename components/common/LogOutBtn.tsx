import { logoutAction } from "@/app/actions/authActions"; // Import corect din noul fișier
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { LuLogOut } from "react-icons/lu";

const LogOutButton = ({ withTooltip = false }) => {
  return withTooltip ? (
    <form action={logoutAction}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded-full bg-slate-100 p-1 dark:bg-slate-300 dark:text-slate-700">
              <LuLogOut size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <button type="submit">Log Out</button>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </form>
  ) : (
    <form action={logoutAction}>
      <button type="submit">LogOut</button>
    </form>
  );
};

export default LogOutButton;
