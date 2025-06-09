import { getInstructor } from "@/lib/getUserData";
import InstructorInfo from "./InstructorInfo";
import getSession from "@/lib/getSession";
import { User } from "next-auth";
import Header from "@/components/common/Header";
import { InstructorTabs } from "./InstructorTabs";
import Footer from "@/components/common/Footer";
import { redirect } from "next/navigation";

export default async function Home({
    params,
    searchParams,
} : {
    params: { instructor: string };
    searchParams: { id?: string };
}) {
    const session = await getSession();
    const user = session?.user as User;
    
    // Extrage ID-ul din query parameters
    const resolvedSearchParams = await searchParams;
    const id = resolvedSearchParams.id;
    
    if (!id) {
        // Dacă nu avem ID, redirecționăm la pagina principală sau afișăm o eroare
        return redirect('/user/bookings'); // Redirect to sessions page for users
    }
    
    const instructor = await getInstructor({ id });
    if(!instructor) {
        return <div>Instructorul nu a fost găsit.</div>;
    }
    
    const { services, timeslots, dcost, lcost } = instructor;

    console.log(`Timeslots received for instructor ${id}:`, timeslots);
    
    return (
        <>
            <Header />
            <section className="mx-auto max-w-7xl">
                <InstructorInfo instructor={instructor} />
                <InstructorTabs
                    services={String(services)}
                    timeSlots={timeslots}
                    dcost={Number(dcost)}
                    lcost={Number(lcost)}
                    instructorId={id}
                    user={user}
                />
            </section>
            <Footer/>
        </>
    );
}