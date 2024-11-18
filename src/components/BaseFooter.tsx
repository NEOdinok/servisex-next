import Link from "next/link";

import { HeaderNavigation } from "./HeaderNavigation";
import { CopyrightServicesex } from "./ui/copyright-servicesex";

const BaseFooter = () => {
  return (
    <footer className="hidden sm:flex w-full justify-between items-center px-4 h-16">
      <div className="flex justify-end gap-4">
        <Link
          href="https://www.instagram.com/goat__corp/?hl=en"
          target="_blank"
          className="uppercase hover:cursor-pointer hover:underline hover:text-primary"
        >
          INSTAGRAM
        </Link>
        <Link
          href="https://www.youtube.com/@goat7480"
          target="_blank"
          className="uppercase hover:cursor-pointer hover:underline hover:text-primary"
        >
          YOUTUBE
        </Link>
      </div>

      <div className="flex justify-end gap-4">
        <CopyrightServicesex />
      </div>
    </footer>
  );
};

export { BaseFooter };
