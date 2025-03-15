"use client";

import { ReactNode } from "react";

import { Toaster } from "@/components";
import { TanStackQueryProvider } from "@/providers/TanStackQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="servisex-light" enableSystem disableTransitionOnChange>
      <TanStackQueryProvider>
        {children}
        <Toaster />
        <SpeedInsights />
      </TanStackQueryProvider>
    </ThemeProvider>
  );
}
