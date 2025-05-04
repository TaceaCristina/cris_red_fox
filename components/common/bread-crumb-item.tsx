"use client"

import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Container from "./Container";
import { Fragment } from "react";

// Definim un tip pentru dicționarul de traduceri
type TranslationsType = {
  [key: string]: string;
};

// Dicționar pentru traducerea segmentelor specifice din URL
const translations: TranslationsType = {
  "users": "Utilizatori",
  "timeslots":"Intervale orare",
  "bookings":"Ședințe",
  "instructors":"Instructori"
};

// Funcția de traducere cu tipuri corecte
const translatePath = (path: string): string => {
  return translations[path.toLowerCase()] || path;
};

export function BreadCrumbItem({ title }: { title?: string }) {
    const pathname = usePathname();
    const pathArray = pathname.split("/").filter(Boolean);
    const itemsExceptLast = pathArray.slice(0, pathArray.length - 1);
    const lastItem = pathArray[pathArray.length - 1];
    
    return (
      <Container>
        <Breadcrumb className="mt-3 rounded-md bg-white p-5 dark:bg-slate-800">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Acasă</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {itemsExceptLast.map((item) => (
              <Fragment key={item}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${item}`} className="capitalize">
                    {translatePath(item)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ))}
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold capitalize">
                {title ? title : translatePath(lastItem)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Container>
    );
}