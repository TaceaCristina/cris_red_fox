import Link from "next/link";
import Image from "next/image";
import AuthForm from "@/components/common/auth-form";
import { getPathname } from "@/lib/utils";

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

async function LoginPage({ searchParams }: LoginPageProps) {
  // Așteaptă searchParams înainte de a accesa proprietățile
  const resolvedSearchParams = await searchParams;
  const callbackUrl = resolvedSearchParams?.callbackUrl;
  const pathname = getPathname(callbackUrl);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 p-5 shadow-lg sm:w-[350px]">
        <div className="flex justify-center">
          <Image src="/img/logo.png" width={128} height={128} alt="logo" />
        </div>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bine ai venit la Red Fox
          </h1>
        </div>

        <AuthForm callbackUrl={pathname} />

        <p className="px-8 text-center text-sm text-muted-foreground">
        Prin continuarea autentificării, accepți{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Termenii și condițiile
          </Link>{" "}
          și{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Politica de confidențialitate
          </Link>{" "}
          ale companiei.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;