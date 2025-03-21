import DashHeader from "@/components/common/DashHeader";
import LogOutBtn from "@/components/common/LogOutBtn";
import { AdminRoutes } from "@/components/common/routes";
import SideNavBar from "@/components/common/SideNavBar";
import ThemeToggle from "@/components/common/ThemeToggler";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <div className="flex min-h-screen bg-red-50 dark:bg-black">
      <aside className="hidden md:block w-16 p-4 bg-white dark:bg-black">
        <Image src="/logo.png" width={50} height={50} alt="logo" />
        <SideNavBar items={AdminRoutes} showTooltip />
        <ThemeToggle />
        <Separator className="my-4" />
        <LogOutBtn withTooltip />
      </aside>

      <div className="w-full flex-1">
        <DashHeader title="Admin Dashboard" />

        {children}
      </div>
    </div>
  );
}