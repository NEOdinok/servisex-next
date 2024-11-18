import { CopyrightGoat } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { IconGoatLogo, IconInstagram, IconYoutube } from "public/icons";
import background from "public/images/goat-home-image.webp";

import { HomeNavigation } from "./HomeNavigation";

const HomeGoat = () => {
  return (
    <div className="welcome grow relative overflow-hidden w-[calc(100%-32px)] h-[calc(100%-32px)] m-4 sm:w-[calc(100%-64px)] sm:h-[calc(100%-64px)] sm:m-8">
      <Image
        src={background}
        alt="Goat.Corp home background"
        className="absolute z-[-1] w-full h-full object-cover object-[right_50%_bottom_-96px] opacity-45 scale-[1.8] sm:top-0 sm:left-0 sm:object-[right_50%_top_42%] sm:scale-100"
        priority
      />
      <div className="content flex flex-col">
        <IconGoatLogo className="w-full h-[128px] mt-[220px] mb-0 ml-auto mr-auto text-white sm:mt-[10%]" />

        <HomeNavigation className="w-full flex justify-center items-center" />

        <div className="flex gap-4 justify-between absolute bottom-4 w-full px-6">
          <div className="flex justify-end gap-4">
            <Link
              href="https://www.instagram.com/goat__corp/?hl=en"
              target="_blank"
              className="uppercase hover:cursor-pointer hover:underline hover:text-primary"
            >
              <IconInstagram className="opacity-45 h-10 hover:opacity-30" />
            </Link>

            <Link
              href="https://www.youtube.com/watch?v=e3KmM2JxRrg"
              target="_blank"
              className="uppercase hover:cursor-pointer hover:underline hover:text-primary"
            >
              <IconYoutube className="opacity-45 h-10  hover:opacity-30" />
            </Link>
          </div>

          <div className="flex justify-end gap-4 opacity-55 items-center">
            <CopyrightGoat />
          </div>
        </div>
      </div>
    </div>
  );
};

export { HomeGoat };
