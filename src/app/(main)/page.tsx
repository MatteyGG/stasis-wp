import WikiCard from "../components/wikicard";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl text-center my-4">Welcome to STASIS</h1>
      <div className="container mx-auto flex flex-wrap py-6 ">
        {/* Блок с случайными wiki страницами */}
        <div className="w-full ">
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ">
            <WikiCard name="WikiCard" category="Category" description="Description" img={{ src: "/placeholder.jpg", alt: "Image" }} link="https://www.google.com" />
            <WikiCard name="WikiCard2" category="Category2" description="Description2" img={{ src: "/placeholder.jpg", alt: "Image" }} link="https://www.google.com" />
            <WikiCard name="WikiCard3" category="Category3" description="Description3" img={{ src: "/placeholder.jpg", alt: "Image" }} link="https://www.google.com" />
            <WikiCard name="WikiCard4" category="Category4" description="Description4" img={{ src: "/placeholder.jpg", alt: "Image" }} link="https://www.google.com" />
            <WikiCard name="WikiCard5" category="Category5" description="Description5" img={{ src: "/placeholder.jpg", alt: "Image" }} link="https://www.google.com" />
            <WikiCard name="WikiCard5" category="Category5" description="Description5" img={{ src: "/placeholder.jpg", alt: "Image" }} link="https://www.google.com" />
          </section>
        </div>
        
        <div className="container w-full flex flex-row items-center">
          {/* Блок с промокодами */}
          <div className="w-1/3 flex flex-col items-center">
            <h1 className="text-3xl">Промокоды</h1>
            <ul className="list-disc list-inside">
              <li>wpcommunity</li>
              <li>WPIAGG</li>
              <li>QUOCKHANHVN</li>
            </ul>
          </div>
          {/* Блок с членами альянса */}
          <div className="w-1/3 flex flex-col mt-4 items-center">
            <h1 className="text-3xl ">Члены альянса</h1>
            <ul className="list-disc list-inside">
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          {/* Блок с уведомлениями */}
          <div className="w-full md:w-1/3 flex flex-col mt-4 items-center">
            <h1 className="text-3xl ">Уведомления</h1>
            <ul className="list-disc list-inside">
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
