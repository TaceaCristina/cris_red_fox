"use server";

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await signOut();
  redirect("/");
}
