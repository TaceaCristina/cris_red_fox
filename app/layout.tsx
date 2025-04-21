import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./Providers";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Școala de soferi Red Fox",
  description: "Ședințe de condus la un click distanță",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  // Transmitem userId DOAR dacă există, altfel undefined
  const userId = session?.user?.id;
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          userId={userId}
        >
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}