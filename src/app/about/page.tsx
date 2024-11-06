import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="about container md:mt-12 mx-auto flex flex-wrap p-4 rounded-xl backdrop-blur-2xl">
      <h1 className="text-6xl text-primaly text-left w-full my-6">
        <b>О нас</b>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <article className=" w-full p-2">
          <h1 className="text-4xl text-primaly text-left">Кто мы?</h1>
          <p className="mt-2 text-pretty indent-2 whitespace-pre-line subpixel-antialiased tracking-wide">
            <span>
              Стазис — международный альянс, преимущественно состоящий из
              русскоязычных игроков. Мы ценим общение и любим проводить время в
              голосовом чате, обсуждая не только игровые моменты, но и просто
              наслаждаясь компанией друг друга.
            </span>
            <br />
            <span>
              Наш основной состав имеет опыт более года игры, что позволяет нам
              уверенно справляться с любыми вызовами. Мы любим повоевать, но не
              забываем о важности дипломатической части игры. В нашем альянсе
              приветствуются инициативы и каждая точка зрения.
            </span>
            <br />
            <span>
              Мы всегда готовы выслушать и поддержать новые идеи, чтобы сделать
              наше сообщество еще сильнее и интереснее. Присоединяйтесь к нам и
              станьте частью нашей дружной команды!
            </span>
          </p>
        </article>
        <div>
          <Image
            className="w-full hover:scale-[1.2] md:hover:scale-[2] ease-in-out duration-700 overflow-visible "
            src="/source/icon/Stasis.png"
            width={300}
            height={300}
            alt=""
          />
        </div>
        <div className="w-full p-2 text-right">
          <h1 className="text-4xl text-primaly">Кому писать?</h1>
          <div className="mt-2">
            <h4>
              По вопросам связаным с техническим состоянием сайта и
              предложениям:
            </h4>
            <button className="mt-2">
              <Link href="https://t.me/ser_dantes_r">
                <Image
                  src="/source/icon/telegram.png"
                  width={36}
                  height={36}
                  alt=""
                />
              </Link>
            </button>
            <button>
              <Link href="https://t.me/ser_dantes_r">
                <Image
                  src="/source/icon/mail.png"
                  width={36}
                  height={36}
                  alt=""
                />
              </Link>
            </button>
          </div>
          <div className="mt-2">
            <h4>По вопросам связаным с игрой:</h4>
            <button className="mt-2">
              <Link href="https://t.me/ser_dantes_r">
                <Image
                  src="/source/icon/telegram.png"
                  width={36}
                  height={36}
                  alt=""
                />
              </Link>
            </button>
            <button>
              <Link href="https://t.me/ser_dantes_r">
                <Image
                  src="/source/icon/mail.png"
                  width={36}
                  height={36}
                  alt=""
                />
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
