import { BaseLayout } from "@/layouts/BaseLayout";
import image from "public/images/servisex-about-image.webp";

const AboutPage = () => {
  return (
    <BaseLayout>
      <div className="flex items-center justify-center flex-col p-10 pt-0">
        <h1 className="w-full text-5xl md:text-7xl text-center font-bold mb-6">SERVISEX®</h1>

        <p className="font-bold text-sm md:text-lg text-center uppercase mb-11">
          SERVICESEX® основан там-то там-то. Нужно смешной абсурд. Занимается тем-то тем-то.
          <br />
          Больше чем бренд и больше чем стиль. Производится вручную, никакой ответственности за качество. Еще текст
          <br />
          Все вещи в единственном экземпляре и, соответственно, соответственно. Чето еще. Можно цитаты с футболок,{" "}
          <br />
          Lorem pipsum. Занимается тем-то тем-то. Больше чем бренд и больше чем стиль. Производится вручную, никакой
          ответственности за качество. Все вещи в единственном экземпляре и, соответственно, соответственно.
        </p>

        <img src={image.src} alt="About page image football style" className="w-full" />
      </div>
    </BaseLayout>
  );
};

export default AboutPage;
