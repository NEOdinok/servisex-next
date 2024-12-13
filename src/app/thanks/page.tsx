import { ProductsShowcase } from "@/components";
import { BaseLayout } from "@/layouts/BaseLayout";
import Link from "next/link";

const ThanksPage = async () => {
  return (
    <BaseLayout>
      <div className="flex grow items-center justify-center gap-2 sm:gap-4 py-2 px-2 sm:py-0">
        <p>Спасибо за твой заказ друг!</p>
        <Link href="/shop">В магазин</Link>
      </div>
    </BaseLayout>
  );
};

export default ThanksPage;
