import { Toaster } from "@/components";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";

import "./globals.css";

// Import Next.js Script component

const roboto_mono = Roboto_Mono({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Title",
  description: "Description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", roboto_mono.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
