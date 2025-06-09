"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { Toaster } from "react-hot-toast";
import { KnockProvider, KnockFeedProvider } from "@knocklabs/react";
import "@knocklabs/react/dist/index.css";

// Suprimă eroarea 'Can't call setState on a component that is not yet mounted' în development (doar pe client)
if (process.env.NODE_ENV === 'development') {
  const suppressedErrors = [
    "Can't call setState on a component that is not yet mounted"
  ];
  const origConsoleError = console.error;
  console.error = (...args) => {
    // Verifică dacă primul argument e string și conține eroarea
    if (
      (typeof args[0] === 'string' && suppressedErrors.some(e => args[0].includes(e))) ||
      // Sau dacă e obiect cu .message ce conține eroarea
      (args[0] && typeof args[0] === 'object' && typeof args[0].message === 'string' &&
        suppressedErrors.some(e => args[0].message.includes(e)))
    ) {
      return;
    }
    origConsoleError(...args);
  };
}

type ProviderProps = {
  userId?: string;
};

const Providers = ({
  children,
  userId,
  ...props
}: ThemeProviderProps & ProviderProps) => {
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
        // Oferim un provider gol pentru cazurile fără userId
        <KnockProvider apiKey="" userId="">
          <KnockFeedProvider feedId="">
            {children}
          </KnockFeedProvider>
        </KnockProvider>
      )}
    </NextThemesProvider>
  );
};

export default Providers;