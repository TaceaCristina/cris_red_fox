// app/(dashboard)/dashboard/users/[user]/page.tsx
import { redirect } from "next/navigation";
import { BreadCrumbItem } from "@/components/common/bread-crumb-item";
import { getUser } from "@/lib/getUserData";
import AddInstructorForm from "./AddInstructorForm";
import getSession from "@/lib/getSession";

// Modificat pentru a respecta noul model recomandat pentru Next.js App Router
export default async function AddInstructorPage({
  params,
  searchParams,
}: {
  params: { user: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();
  const user = session?.user;
  
  if (!user || user.role !== "ADMIN") {
    redirect(user ? "/" : "/api/auth/signin?callbackUrl=/dashboard");
  }
  
  // Așteaptă params
  const resolvedParams = await params;
  const id = resolvedParams.user;
  
  // Așteaptă searchParams
  const resolvedSearchParams = await searchParams;
  
  // Acum poți accesa name în siguranță
  let currentName = "";
  const nameParam = resolvedSearchParams["name"];
  if (nameParam !== undefined) {
    currentName = Array.isArray(nameParam) ? nameParam[0] || "" : nameParam;
  }
    
  const getIsInstructor = await getUser({ id });
  const isInstructor = getIsInstructor?.instructor;
  
  if (isInstructor) {
    redirect("/user/bookings");
  }
  
  return (
    <>
      <BreadCrumbItem title={currentName} />
      <main className="m-auto my-10 max-w-3xl space-y-10 rounded-md bg-white dark:bg-black">
        <div className="space-y-5 text-center">
          <h1 className="py-3 text-xl font-semibold">
            Adaugă profilul instructorului: {currentName}
          </h1>
        </div>
        <div className="space-y-6 rounded-lg p-4">
          <AddInstructorForm userId={id} />
        </div>
      </main>
    </>
  );
}