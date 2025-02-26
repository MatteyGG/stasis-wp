"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Parallax } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import WikiCard from "../wikicard";

export default function WikiContainer({
  card_array,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  card_array: any[];
}) {
  return (
    <>
      <section className="relative overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Parallax]}
          spaceBetween={10}
          grabCursor={true}
          height={600}
          slidesPerView={2}
          parallax={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
            1280: { slidesPerView: 8 },
          }}
          navigation
          pagination={{ clickable: true }}
          className="text-white relative "
        >
          {card_array.map((card, index) => (
            <SwiperSlide
              key={card.pageId || index}
              className="isolate relative overflow-visible z-40 min-h-[300px]"
            >
              <WikiCard
                title={card.title ?? "Туториал"}
                category={card.category ?? ""}
                description={card.short ?? ""}
                img={{ src: card.scr, alt: card.alt ?? "" }}
                link={`wiki/${card.category}/${card.pageId}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
}
