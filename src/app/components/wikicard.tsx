import Link from "next/link";
import Image from "next/image";

export interface WikiCardProps {
    title: string;
    category: string;
    description: string;
    img: {
      src: string;
      alt: string;
    };
    link: string;
}

const WikiCard =  ( { title, category, description, img, link }: WikiCardProps ) => {
  return (
    <div className="wikicard container will-change-transform ">
      <div className="wikicard h-full container flex flex-col text-wrap w-full bg-primaly rounded-2xl p-2 ">
        <span className="z-20 wikicard-category absolute text-white text-xs bg-primaly p-2 rounded-br-xl ">
          {category}
        </span>
        <div className="h-full relative">
          <Image
            src={img.src}
            alt={img.alt}
            quality={100}
            className="w-full rounded-2xl animate-bounceIn"
            width={150}
            height={150}
          />

          <h1 className="wikicard-title text-base">
            <b>{title}</b>
          </h1>
          <p className="wikicard-description text-wrap text-xs">
            {description}
          </p>
        </div>
        <div className="flex justify-center ">
          <Link href={link}>
            <button className="wikicard-button w-full bg-primaly p-2 rounded-2xl">
              Читать!
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WikiCard;
