import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineLockClosed } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import { User } from "next-auth";

export function AvatarNav({user}: {user: User})
{
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full">
                    <Avatar className="">
                        <AvatarImage src={user?.image as string} alt="redfox"/>
                        <AvatarFallback>Fox</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="front-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className="flex gap-2">
                    <HiOutlineUser size={18} />
                    <Link href="/user">Profil</Link>
                </DropdownMenuItem>

                {user?.role === "ADMIN" && (
                    <DropdownMenuItem className="flex gap-2">
                        <HiOutlineLockClosed size={18} />
                        <Link href="/dashboard">Admin</Link>
                    </DropdownMenuItem>
                )}
                {user?.role === "INSTRUCTOR" && (
                    <DropdownMenuItem className="flex gap-2">
                        <HiOutlineLockClosed size={18} />
                        <Link href="/portal">Portal</Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem className="flex gap-2">
                    <LuLogOut size={18} />
                    {/*LogOut*/}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu> 
    )
}