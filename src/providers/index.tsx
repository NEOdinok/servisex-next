"use client";

import { ReactNode } from "react";

import { Toaster } from "@/components";
import { TanStackQueryProvider } from "@/providers/TanStackQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <TanStackQueryProvider>
        {children}
        <Toaster />
      </TanStackQueryProvider>
    </ThemeProvider>
  );
}
