import { getInstructor } from "@/lib/getUserData";
import InstructorInfo from "./InstructorInfo";
import getSession from "@/lib/getSession";
import { User } from "next-auth";
import Header from "@/components/common/Header";
import { InstructorTabs } from "./InstructorTabs";
import Footer from "@/components/common/Footer";


export default async function Home({
    searchParams,
} : {
    searchParams: { [key: string]: string | string[] | undefined};
}) {
    const session = await getSession();
    const user = session?.user as User;

    const id = searchParams.id as string;

    const instructor = await getInstructor({ id });

    if(!instructor) {
        return <div>Instructorul nu a fost găsit.</div>;
    }

    const { services, timeslots, dcost, lcost } = instructor;

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