import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scoala de soferi Red Fox",
  description: "Sedinte de condus la un click distanta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
