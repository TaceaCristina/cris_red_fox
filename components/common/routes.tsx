'use client'

import { HiOutlineHome } from "react-icons/hi";
import { MdImportantDevices, MdOutlineMenuBook } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { HiOutlineUserGroup, HiOutlineUser } from "react-icons/hi2";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsStopwatch } from "react-icons/bs";
import { CiLogin } from "react-icons/ci";
import { TbMessage } from "react-icons/tb";

export const InstructorRoutes = [
  {
    title: "Acasă",
    href: "/",
    icon: HiOutlineHome,
  },
  {
    title: "Portal",
    href: "/portal",
    icon: MdImportantDevices,
  },
  {
    title: "Ședințe",
    href: "/portal/bookings",
    icon: MdOutlineMenuBook,
  },
  {
    title: "Notificări",
    href: "/portal/messages",
    icon: TbMessage,
  },
  {
    title: "Setări",
    href: "/portal/settings",
    icon: IoSettingsOutline,
  },
];

export const AdminRoutes = [
  {
    title: "Acasă",
    href: "/",
    icon: HiOutlineHome,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LuLayoutDashboard,
  },
  {
    title: "Utilizatori",
    href: "/dashboard/users",
    icon: HiOutlineUserGroup,
  },
  {
    title: "Instructori",
    href: "/dashboard/instructors",
    icon: LiaChalkboardTeacherSolid,
  },
  {
    title: "Intervale orare",
    href: "/dashboard/timeslots",
    icon: BsStopwatch,
  },
  {
    title: "Ședințe",
    href: "/dashboard/bookings",
    icon: MdOutlineMenuBook,
  },
  {
    title: "Setări",
    href: "/dashboard/settings",
    icon: IoSettingsOutline,
  },
];

export const UserRoutes = [
  {
    title: "Acasă",
    href: "/",
    icon: HiOutlineHome,
  },
  {
    title: "Cont",
    href: "/user",
    icon: HiOutlineUser,
  },
  {
    title: "Ședințe",
    href: "/user/bookings",
    icon: MdOutlineMenuBook,
  },
  {
    title: "Notificări",
    href: "/user/messages",
    icon: TbMessage,
  },
];

export const LoginRoute = [
  {
    title: "Login",
    href: "/login",
    icon: CiLogin,
  },
];