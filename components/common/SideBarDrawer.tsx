"use client";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTrigger,
    DrawerTitle,
} from "@/components/ui/drawer";
import { TiThMenu } from "react-icons/ti";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import SideNavBar from "./SideNavBar";
import { AdminRoutes, InstructorRoutes, LoginRoute, UserRoutes } from "./routes";
import ThemeToggle from "./ThemeToggler";
import LogOutButton from "./LogOutBtn";
import { Role } from "@prisma/client";


const getNavItems = (role: Role) => {
    switch (role) {
        case "ADMIN":
            return AdminRoutes;
        case "INSTRUCTOR":
            return InstructorRoutes;
        case "USER":
            return UserRoutes;
        default:
            return LoginRoute;
    }
};


const SideBarDrawer = ({ role }: { role: Role }) => {
    const navItems = getNavItems(role);

    return (
        <Drawer>
            <DrawerTrigger className="rounded-full bg-red-100 p-2 text-red-500">
                <TiThMenu size={24} />
            </DrawerTrigger>
            <DrawerContent className="fixed inset-0 mt-0 h-screen w-40">
                <DrawerHeader>
                <DrawerTitle>
                    <div className="flex justify-center">
                        <Avatar>
                            <AvatarImage src="/img/logo.png" alt="fox" />
                            <AvatarFallback>US</AvatarFallback>
                        </Avatar>
                    </div> 
                </DrawerTitle>
            </DrawerHeader>
            <SideNavBar items={navItems} showTooltip={false}  className="p-4" />
            <Separator className="my-4" />
            <div className="space-y-3 p-4">
                <ThemeToggle/>
                <LogOutButton withTooltip/>
            </div>
            </DrawerContent>
        </Drawer>
    );
};

export default SideBarDrawer;