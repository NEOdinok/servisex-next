import Link from "next/link";
import { HeaderNavigation } from "./HeaderNavigation";

const BaseHeader = () => {
  return (
    <header className="sticky z-10 top-0 flex h-16 items-center justify-between px-4 bg-background">
      <div className="header-left flex justify-start">
        <HeaderNavigation />
      </div>
      <div className="header-right flex justify-start">
        <Link
          href="/cart"
          className="uppercase text-primary hover:cursor-pointer hover:underline hover:text-primary sm:text-foreground text-2xl sm:text-base"
        >
          КОРЗИНА(0)
        </Link>
      </div>
    </header>
  );
};

export { BaseHeader };
