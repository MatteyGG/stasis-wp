// components/MvpCarousel.tsx
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { MVPcard } from "@/components/MVPcard";
import Link from "next/link";
import { getMapValue } from "@/constants/maps";

interface MvpData {
  player?: {
    username: string;
  } | null;
  category: string;
  title: string;
  image: string;
  value: string | number;
}

interface MvpCarouselProps {
  mvps: MvpData[];
  c4Id?: string | null;
  c4Map?: string | null;
  showLink?: boolean;
}

export default function MvpCarousel({ 
  mvps, 
  c4Id, 
  c4Map, 
  showLink = true
}: MvpCarouselProps) {
  return (
    <>
      <Carousel className="mt-2 w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {mvps.map((mvp, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/5">
              <MVPcard
                nickname={mvp.player?.username || "NoNick"}
                title={mvp.title}
                value={mvp.value}
                category={mvp.category}
                imageUrl={mvp.image}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {showLink && c4Id && (
        <div className="w-full text-center">
          <Link
            href={`/c4/${c4Id}`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Статистика за {getMapValue(c4Map || '')}
          </Link>
        </div>
      )}
    </>
  );
}