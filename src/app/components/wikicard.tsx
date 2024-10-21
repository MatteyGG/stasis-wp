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
    <div className="wikicard container">
        <div className="wikicard container flex flex-col text-wrap w-full h-full bg-primaly rounded-2xl p-2">
          <Image
            src={img.src}
            alt={img.alt}
            quality={100}
            className="w-full rounded-2xl animate-bounceIn"
            width={150}
            height={150}
          />
          <span className="wikicard-category absolute text-white text-1xl bg-primaly p-2 rounded-br-xl ">
            {category}
          </span>
          <h1 className="wikicard-title"><b>{title}</b></h1>
          <p className="wikicard-description text-wrap">
          {description}          
          </p>
        <Link href={link}>
          <button className="wikicard-button w-full bg-primaly p-2 rounded-2xl">Читать!</button>
        </Link>
      </div>
    </div>
  );
};

export default WikiCard;