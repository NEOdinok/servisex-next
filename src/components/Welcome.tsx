import background from "public/images/goat-home-image.webp";
import Link from "next/link";
import { IconInstagram, IconYoutube, IconGoatLogo } from "public/icons";
import Image from "next/image";
import { HomeNavigation } from "./HomeNavigation";

const Welcome = () => {
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
        {/* <GoatLogo /> */}

        <HomeNavigation className="w-full flex justify-center items-center" />

        <div className="flex gap-4 items-center justify-center justify-self-end absolute bottom-4 w-full">
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
      </div>
    </div>
  );
};

export { Welcome };
