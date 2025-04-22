import { redirect } from "next/navigation";
import { BreadCrumbItem } from "@/components/common/bread-crumb-item";
import { getUser } from "@/lib/getUserData";
import AddInstructorForm from "./AddInstructorForm";
import getSession from "@/lib/getSession";

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

  const id = params.user;
  const currentName = Array.isArray(searchParams.name)
  ? searchParams.name[0]
  : searchParams.name ?? "";

  const getIsInstructor = await getUser({ id });
  const isInstructor = getIsInstructor?.instructor;

  if (isInstructor) {
    redirect("/dashboard/instructors");
  }

  return (
    <>
      <BreadCrumbItem />
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