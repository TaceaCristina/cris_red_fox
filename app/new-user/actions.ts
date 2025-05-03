"use server";

import { userAccountSchema } from "@/lib/zod-validations";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";


type UpdateUserArgs = {
  formData: FormData;
  id: string;
};

export async function UpdateUser({ formData, id }: UpdateUserArgs) {
  const values = Object.fromEntries(formData.entries());

  const { name, phone, address } = userAccountSchema.parse(values);

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        address,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error); 
    }
    return { message: "An unexpected error occurred." };
  } 
  
  redirect("/user");
}