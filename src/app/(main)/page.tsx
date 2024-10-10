import WikiCard from "../components/wikicard";

export default function Home() {
  return (
    <>
      <div className="container shadow-2xl mt-12 mx-auto flex flex-wrap p-4 rounded-lg  backdrop-blur-md text-white">
      <h1 className="text-6xl text-primaly text-center w-full my-6"><b>Welcome to STASIS</b></h1>
        {/* Блок с случайными wiki страницами */}
        <div className="w-full ">
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 text-pretty">
            <WikiCard name="Авиация Гайд" category="Army" description="Авиация — это самый важный и мощный юнит в игре. Контроль воздушного пространства определяет успех на земле." img={{ src: "/placeholder.jpg", alt: "Image" }} link="https://www.google.com" />
            <WikiCard name="WikiCard2" category="Economy" description="Description2" img={{ src: "/placeholder.jpg", alt: "Image" }} link="https://www.google.com" />
            <WikiCard name="Перси" category="Officers" description="Перси — офицер поддержки с защитными пассивными способностями. Обладая сбалансированными навыками, Перси идеально подходит для различных типов юнитов, улучшая как атаку, так и защиту." img={{ src: "/placeholder.jpg", alt: "Image" }} link="https://www.google.com" />
            <WikiCard name="Полный вперед!" category="Economy" description="Чтобы быстрее развивать свою базу и исследовать новые технологии, важно эффективно использовать ускорения на такие ключевые материалы, как древесина, кирпич, цемент, железная балка и асфальт." img={{ src: "/placeholder.jpg", alt: "Image" }} link="https://www.google.com" />
            <WikiCard name="Вертолет" category="Army" description="Советский истребитель танков с самым высоким пробитием представляет собой мощную боевую единицу, способную наносить значительный урон практически любым противникам на поле боя." img={{ src: "/placeholder.jpg", alt: "Image" }} link="https://www.google.com" />
            <WikiCard name="WikiCard5" category="Officers" description="Description5" img={{ src: "/placeholder.jpg", alt: "Image" }} link="https://www.google.com" />
          </section>
        </div>
        
        <div className="container w-full mt-4 flex flex-row items-center text-primaly">
          {/* Блок с промокодами */}
          <div className="w-1/3 flex flex-col items-center">
            <h1 className="text-3xl"><b>Промокоды</b></h1>
            <ul className="list-disc list-inside">
              <li><b>wpcommunity</b></li>
              <li><b>WPIAGG</b></li>
              <li><b>QUOCKHANHVN</b></li>
            </ul>
          </div>
          {/* Блок с членами альянса */}
          <div className="w-1/3 flex flex-col mt-4 items-center">
            <h1 className="text-3xl "><b>Члены альянса</b></h1>
            <ul className="list-disc list-inside">
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          {/* Блок с уведомлениями */}
          <div className="w-full  md:w-1/3 flex flex-col mt-4 items-center ">
            <h1 className="text-3xl "><b>Уведомления</b></h1>
            <ul className=" list-inside">
              <li>Нет новых сообщений</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
