import Image from "next/image";
import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-foreground transition-colors">
      <div className="w-full max-w-4xl px-6 py-8">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/img/logo.png" alt="Red Fox Logo" width={100} height={100} />
          </Link>
        </div>
        <div className="bg-card rounded-lg shadow p-6">
          {children}
        </div>
      </div>
    </div>
  );
}