"use client";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTrigger,
    DrawerTitle,
} from "@/components/ui/drawer";
import { TiThMenu } from "react-icons/ti";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import SideNavBar from "./SideNavBar";
import { UserRoutes } from "./routes";



const SideBarDrawer = () => {


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
                            <AvatarImage src="/img/logo.png" alt="de-mawo" />
                            <AvatarFallback>US</AvatarFallback>
                        </Avatar>
                    </div> 
                </DrawerTitle>
            </DrawerHeader>
                <SideNavBar items={UserRoutes} showTooltip={false}  className="p-4" />
                    <Separator className="my-4" />
                        <div className="space-y-3 p-4">
                            <p>Dark/light</p>
                            <p>Sign out</p>
                    </div>
            </DrawerContent>
        </Drawer>
    );
};

export default SideBarDrawer;