import { Button } from "@/components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BaseLayout } from "@/layouts/BaseLayout";
import Image from "next/image";
import image from "public/images/martin_sample.jpeg";

const AboutPage = () => {
  return (
    <BaseLayout>
      <div className="flex flex-col md:flex-row h-full items-center justify-center p-10 pt-0 gap-5">
        <div>
          <p className="font-bold text-sm md:text-lg uppercase 1 text-left">
            SERVISEX® <br />
            <br />
            Лида, Беларусь, Гараж.
            <br />
            Больше чем бренд и больше чем стиль. Производится вручную, никакой ответственности за качество не несем.
            <br />
            Все вещи в единственном экземпляре и ограниченном тираже
          </p>

          <LegalInfo />
        </div>

        <Image
          src={image.src}
          alt="About page margin with sample t-shirt"
          width={960}
          height={1280}
          className="max-h-[75vh] w-auto h-auto object-contain"
        />
      </div>
    </BaseLayout>
  );
};

export default AboutPage;

const LegalInfo: React.FC = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="mt-4 text-foreground" variant="outline" size="lg">
        Показать Контакты
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <p className="font-bold uppercase">Контакты</p>
        </DialogTitle>
        <DialogDescription>
          <div className="text-sm md:text-lg text-left space-y-2">
            <div>ИП МАРТЫНОВИЧ ГЕОРГИЙ МАКСИМОВИЧ</div>
            <div>
              ИНН: 504806879532 <br />
              ОГРНИП: 325508100347040
            </div>
            <div>Юр. адрес: 142703, Россия, Московская область, г. Видное, мкр. Солнечный, д. 6, кв. 96</div>
            <div>Факт. адрес: Россия, Москва</div>
            <div>
              Банк: АО «ТБанк» <br />
              Р/с: 4080 2810 3000 0847 4991 <br />
              БИК: 044525974 <br />
              ИНН банка: 7710140679 <br />
              К/с: 3010 1810 1452 5000 0974 <br />
              Адрес банка: 127287, г. Москва, ул. Хуторская 2-я, д. 38А, стр. 26
            </div>
            <div>
              Контакты: <br />
              <a href="mailto:goshamartynovich@gmail.com" className="underline">
                goshamartynovich@gmail.com
              </a>
              <br />
              +995 591 511 715 <br />
              +7 903 624-55-56 <br />
              <a href="https://t.me/shshmarti" className="underline">
                @shshmarti
              </a>
              <br />
              <a href="https://t.me/goshamartynovich" className="underline">
                @goshamartynovich
              </a>
              <br />
              Круглосуточно
            </div>

            <p>(Без этого нам не включат сайт)</p>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);
