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

const WikiCard = ({
  title,
  category,
  description,
  img,
  link,
}: WikiCardProps) => {
  return (
    <Link
      className="z-5 grid grid-cols-1 grid-rows-10 h-[300px] text-wrap w-full bg-gray-800 rounded-2xl p-2 select-none"
      href={link}
    >
      <span className=" wikicard-category absolute text-white text-xs bg-gray-800 p-2 rounded-br-xl ">
        {category}
      </span>
      <Image
        src={img.src}
        alt={img.alt}
        quality={100}
        className="w-full rounded-2xl rounded-b-none animate-bounceIn row-start-1 row-end-5"
        width={150}
        height={150}
      />

      <span className="flex flex-col bg-gray-800 row-start-6 row-end-10">
        <h1 className="wikicard-title py-1 tracking-tight text-sm/4">
          <b>{title}</b>
        </h1>

        <p className="wikicard-description tracking-tight line-clamp-3  text-wrap text-xs">
          {description}
        </p>
      </span>
      <span className="flex justify-center row-start-10 row-end-10">
        <button className="wikicard-button w-full bg-gray-800 pb-2 rounded-2xl">
          Читать!
        </button>
      </span>
    </Link>
  );
};

export default WikiCard;
