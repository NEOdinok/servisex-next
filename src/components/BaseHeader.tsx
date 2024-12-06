"use client";

import { useEffect, useState } from "react";

import { HeaderCartCounter, Sidebar } from "@/components";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const BaseHeader = () => {
  const environment = process.env.NEXT_PUBLIC_ENV;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  const removeScrollFromAppContent = (sidebarOpen: boolean) => {
    if (sidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newState = !prev;

      removeScrollFromAppContent(newState);

      return newState;
    });
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <>
      <header className="sticky z-10 top-0 flex h-16 items-center justify-between px-4 bg-background">
        <div className="header-left flex items-center">
          <BurgerButton className="block sm:hidden p-2" onClick={toggleSidebar} isOpen={isSidebarOpen} />
          <DesktopHeaderNavigation className="hidden sm:flex gap-4" />
        </div>
        {environment}

        <div className="header-right flex items-center">
          <HeaderCartCounter />
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
    </>
  );
};

export { BaseHeader };

type BurgerButtonProps = {
  onClick: () => void;
  className?: string;
  isOpen: boolean;
};

const BurgerButton: React.FC<BurgerButtonProps> = ({ onClick, isOpen, className }) => {
  return (
    <button onClick={onClick} aria-label={isOpen ? "Close menu" : "Open menu"} className={className}>
      <Menu size={32} />
    </button>
  );
};

type DesktopHeaderNavigationProps = {
  className: string;
};

const DesktopHeaderNavigation: React.FC<DesktopHeaderNavigationProps> = ({ className }) => {
  return (
    <nav className={className}>
      <Link href="/" className="hover:cursor-pointer uppercase hover:underline hover:text-primary">
        ГЛАВНАЯ
      </Link>
      <Link href="/shop" className="hover:cursor-pointer uppercase hover:underline hover:text-primary">
        МАГАЗИН
      </Link>
      <Link href="/about" className="hover:cursor-pointer uppercase hover:underline hover:text-primary">
        ЧТО ЭТО?
      </Link>
    </nav>
  );
};
