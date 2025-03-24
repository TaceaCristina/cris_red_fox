"use client";
import { useState, useEffect } from "react";
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
    const [navItems, setNavItems] = useState<{ href: string; title: string; icon: any }[] | null>(null);

    useEffect(() => {
        const items = getNavItems(role);
        setNavItems(items);
    }, [role]);
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

                {/* Afișează un loader dacă `navItems` e încă null */}
                {navItems === null ? (
                    <p className="text-sm text-gray-500 p-2">⏳ Loading menu...</p>
                ) : (
                    <>
                        {navItems.length > 0 && <SideNavBar items={navItems} showTooltip={false} className="p-4" />}
                        <Separator className="my-4" />
                        <div className="space-y-3 p-4">
                            <ThemeToggle />
                            <LogOutButton withTooltip />
                        </div>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default SideBarDrawer;
