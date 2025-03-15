"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group toast rounded-none p-4  border border-input items-center bg-background flex justify-between gap-4 text-xs font-bold ",
          description: " text-muted-foreground",
          actionButton: "rounded-none text-nowrap border border-primary hover:bg-primary hover:text-background p-4",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
