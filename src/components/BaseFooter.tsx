import Link from "next/link";

import { CopyrightServisex } from "./ui/copyright-servisex";

const BaseFooter = () => {
  return (
    <footer className="hidden sm:flex w-full justify-between items-center px-4 h-16">
      <div className="flex justify-end gap-4">
        <Link
          href="https://www.instagram.com/servisex.eu/"
          target="_blank"
          className="uppercase hover:cursor-pointer hover:underline hover:text-primary"
        >
          INSTAGRAM
        </Link>
        <Link
          href="https://www.youtube.com/watch?v=oDCL6CnsSDE&ab_channel=DIGBMXOfficial"
          target="_blank"
          className="uppercase hover:cursor-pointer hover:underline hover:text-primary"
        >
          YOUTUBE
        </Link>
      </div>

      <div className="flex justify-end gap-4">
        <CopyrightServisex />
      </div>
    </footer>
  );
};

export { BaseFooter };
