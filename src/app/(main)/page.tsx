import { prisma } from "../../lib/prisma";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PromocodeItem from "../../components/promocodes";
import WikiContainer from "../../components/wiki/wikicontainer";
import { WarpathCard } from "@/components/NewUi/newcomp";
import TelegramChat from "@/components/telegramChat";
import C4Card from "@/components/c4/c4Card";


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";
import { MVPcard } from "@/components/MVPcard";

export default async function Home() {

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/promocode`
  );
  const promocodes = await response.json();
  const sortedPromocodes = [...promocodes.data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  console.log("Fetching current C4...");
  const currentC4Promise = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/c4/current`)
    .then((res) => res.json())
    .catch((error) => null);
  const currentC4 = await currentC4Promise;

  return (
    <>
      <div className="container mt-4 md:mt-12 mx-auto flex flex-wrap p-2 md:p-4 rounded-xl">
        {/* Карусель */}
        <Carousel className="mt-2 w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            <CarouselItem className="pl-2 md:pl-4 basis-1/2 md:basis-1/5">
              <MVPcard nickname="Mafon" description="Убийца">
            <Image src="/test.png" alt="1" className="object-cover z-0" fill quality={100} />
              </MVPcard>
            </CarouselItem>
            <CarouselItem className="pl-2 md:pl-4 basis-1/2 md:basis-1/5">
              <MVPcard nickname="Mafon" description="Главный фермер">
                <Image src="/KD.png" alt="1" className="object-cover z-0" fill quality={100} />
              </MVPcard>
            </CarouselItem>
            <CarouselItem className="pl-2 md:pl-4 basis-1/2 md:basis-1/5">
              <MVPcard nickname="Mafon" description="Главный фермер">
                <Image src="/die.png" alt="1" className="object-cover z-0" fill quality={100} />
              </MVPcard>
            </CarouselItem>
            <CarouselItem className="pl-2 md:pl-4 basis-1/2 md:basis-1/5">
              <MVPcard nickname="Mafon" description="Главный фермер">
                <Image src="/die.png" alt="1" className="object-cover z-0" fill quality={100} />
              </MVPcard>
            </CarouselItem>
            <CarouselItem className="pl-2 md:pl-4 basis-1/2 md:basis-1/5">
              <MVPcard nickname="Mafon" description="Главный фермер">
                <Image src="/collect.png" alt="1" className="object-cover z-0" fill quality={100} />
              </MVPcard>
            </CarouselItem>
          </CarouselContent>
            <CarouselPrevious className=" hidden" />
            <CarouselNext className=" hidden"/>
        </Carousel>

       <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {/* Блок с промокодами */}
          <WarpathCard className="md:col-span-1 ">
            <ul className="m-2 md:m-4 mt-8 md:mt-12 grid grid-cols-2 gap-2">
              {sortedPromocodes.slice(0, 10).map((promocode, index) => (
                <PromocodeItem key={index} promocode={promocode} />
              ))}
            </ul>
          </WarpathCard>
          
          {/* Блок с уведомлениями */}
          <WarpathCard className="md:col-span-1">
            <TelegramChat discussion="stasis_guest/4"
              commentsLimit={4}
              color="#FFFFF"
            />
          </WarpathCard>
          
          {/* Блок C4 */}
          <div className="md:col-span-1">
            <C4Card status={currentC4.status} players={currentC4.players} map={currentC4.map} />
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

