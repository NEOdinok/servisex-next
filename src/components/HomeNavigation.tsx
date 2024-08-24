import Link from "next/link";

interface MenuProps {
  className?: string;
}

const HomeNavigation = ({ className }: MenuProps) => {
  return (
    <nav className={className}>
      <ul className={"flex flex-col items-start mt-5 g-2 gap-2 w-fit"}>
        <li>
          <Link
            className="cursor-pointer p-2 w-fit hover:bg-foreground hover:text-background hover:underline"
            target="_blank"
            href="https://www.youtube.com/watch?v=e3KmM2JxRrg"
          >
            RED SPRING [2022]
          </Link>
        </li>
        <li>
          <Link
            href="/shop"
            className="cursor-pointer p-2 w-fit hover:bg-foreground hover:text-background hover:underline"
          >
            Store
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="cursor-pointer p-2 w-fit hover:bg-foreground hover:text-background hover:underline"
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export { HomeNavigation };
