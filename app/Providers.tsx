"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { Toaster } from "react-hot-toast";
import { KnockProvider, KnockFeedProvider } from "@knocklabs/react";
import "@knocklabs/react/dist/index.css";

type ProviderProps = {
  userId?: string;
};

const Providers = ({
  children,
  userId,
  ...props
}: ThemeProviderProps & ProviderProps) => {
  // Verificăm dacă userId există ȘI nu este string gol
  const hasValidUserId = userId && userId.trim() !== "";

  return (
    <NextThemesProvider {...props}>
      <Toaster position="top-center" reverseOrder={false} />
      {hasValidUserId ? (
        <KnockProvider
          apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY as string}
          userId={userId}
        >
          <KnockFeedProvider
            feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID as string}
          >
            {children}
          </KnockFeedProvider>
        </KnockProvider>
      ) : (
        // Dacă nu avem un userId valid, renderăm doar copiii fără KnockProvider
        children
      )}
    </NextThemesProvider>
  );
};

export default Providers;