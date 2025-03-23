// Create a new client component for sign out functionality
// components/common/ClientLogOutBtn.tsx
'use client'

import { signOut } from "next-auth/react";
import { LuLogOut } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const LogOutBtn = ({ withTooltip = false }) => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return withTooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={handleSignOut}
            className="rounded-full bg-slate-100 p-1 dark:bg-slate-300 dark:text-slate-700"
          >
            <LuLogOut size={20} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Log Out</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <button onClick={handleSignOut}>LogOut</button>
  );
};

export default LogOutBtn;