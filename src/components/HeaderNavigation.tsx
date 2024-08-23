import Link from "next/link";

const HeaderNavigation = () => {
  return (
    <nav className="hidden sm:flex gap-4">
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

export { HeaderNavigation };
