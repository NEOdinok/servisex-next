import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

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
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <body className={roboto_mono.className}>{children}</body>
      </ThemeProvider>
    </html>
  );
}
