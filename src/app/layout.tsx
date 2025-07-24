import { LoadingServisex } from "@/components";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import favicon from "./favicon.ico";
import "./globals.css";

const inter = Inter({ subsets: ["cyrillic"] });
export const metadata: Metadata = {
  title: "SERVISEX™",
  description: "All products crafted by hand in Belarus. We take no responsibility for the quality",
  icons: {
    icon: favicon.src,
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("antialiased", inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

const StayTunedPlaceholder: React.FC = () => {
  return (
    <html lang="en" className="w-full h-full">
      <body className={cn("antialiased  w-full h-full flex justify-center items-center", inter.className)}>
        <div>
          <h1 className="text-3xl font-bold text-center mb-6">
            SERVISEX<sup>tm</sup> will open August 2025.
            <br />
            Stay tuned.
          </h1>
          <LoadingServisex />
        </div>
      </body>
    </html>
  );
};
